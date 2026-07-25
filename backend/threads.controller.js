const express = require('express');
const router = express.Router();
const snowflake = require('snowflake-id'); // Assuming standard snowflake generator
const db = require('../db'); // Mock database connection
const { broadcastToChannel } = require('../websockets'); // Mock WS emitter

// TODO: move snowflake-id to a shared util later
const idGenerator = new snowflake({ mid: 1, offset: (new Date().getFullYear() - 1970) * 31536000000 });

// POST new thread
router.post('/:channelId/threads', async (req, res) => {
    const { channelId } = req.params;
    const { threadName, firstMessageId, durationDays = 7 } = req.body;
    const userId = req.user.id;
    const username = req.user.username; // get username from auth

    // verify perms first
    const hasPerms = await db.checkPermissions(userId, channelId, 'CREATE_THREADS');
    if (!hasPerms) {
        return res.status(403).json({ error: 'nope, no perms for this' });
    }

    const threadId = idGenerator.generate();

    try {
        await db.transaction(async (trx) => {
            // Create the thread entry (treated as a sub-channel)
            await trx('channels').insert({
                id: threadId,
                parent_channel_id: channelId,
                thread_id: threadId,
                thread_name: threadName,
                creator_id: userId,
                creator_username: username,
                duration_days: durationDays,
                is_archived: false,
                is_closed: false
            });

            // If it originated from a message, associate the message with the thread
            if (firstMessageId) {
                await trx('messages')
                    .where({ id: firstMessageId, channel_id: channelId })
                    .update({
                        thread_id: threadId,
                        thread_name: threadName
                    });
            }
        });

        // Emit WS Event
        broadcastToChannel(channelId, 'THREAD_CREATE', {
            threadId,
            threadName,
            parentChannelId: channelId,
            creator: { id: userId, username }
        });

        res.status(201).json({ threadId, threadName, status: 'created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/v1/channels/:channelId/threads
 * List all threads for a channel (dropdown menu)
 */
router.get('/:channelId/threads', async (req, res) => {
    const { channelId } = req.params;
    
    try {
        // Fetch threads ordered by last message timestamp (mock logic)
        const threads = await db('channels')
            .where({ parent_channel_id: channelId })
            .orderBy('last_message_timestamp', 'desc');

        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PUT /api/v1/threads/:threadId/status
 * Update thread status (close, open, archive, unarchive)
 */
router.put('/threads/:threadId/status', async (req, res) => {
    const { threadId } = req.params;
    const { action } = req.body; // 'close', 'open', 'archive', 'unarchive'
    const userId = req.user.id;

    try {
        const thread = await db('channels').where({ id: threadId }).first();
        if (!thread) return res.status(404).json({ error: 'Thread not found' });

        const hasManagePerms = await db.checkPermissions(userId, thread.parent_channel_id, 'MANAGE_CHANNELS');

        let updateData = {};
        if (action === 'close') updateData.is_closed = true;
        if (action === 'open') updateData.is_closed = false;
        if (action === 'archive') {
            if (!hasManagePerms) return res.status(403).json({ error: 'Requires Manage Channels perms' });
            updateData.is_archived = true;
        }
        if (action === 'unarchive') {
            if (!hasManagePerms) return res.status(403).json({ error: 'Requires Manage Channels perms' });
            updateData.is_archived = false;
        }

        await db('channels').where({ id: threadId }).update(updateData);
        
        broadcastToChannel(thread.parent_channel_id, 'THREAD_STATE_CHANGE', {
            threadId,
            action,
            updatedBy: userId
        });

        res.status(200).json({ success: true, state: updateData });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
