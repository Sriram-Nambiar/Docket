import { NextResponse } from 'next/server';
import { checkRedisStatus, getRedisClient } from '../../../lib/redisClient';
import { processNotificationFanout } from '../../../lib/notificationFanout';

export async function GET() {
  try {
    const redisInfo = await checkRedisStatus();
    let history = [];
    let queueLength = 0;

    if (redisInfo.connected) {
      const redis = getRedisClient();
      const rawHistory = await redis.lrange('compliance:notifications:history', 0, 19);
      history = rawHistory.map(item => {
        try { return JSON.parse(item); } catch (e) { return null; }
      }).filter(Boolean);

      queueLength = await redis.llen('compliance:notifications:queue');
    }

    return NextResponse.json({
      success: true,
      redisInfo,
      queueLength,
      historyCount: history.length,
      history,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { eventType, title, description, entityName, recipient, channels, metadata } = body;

    if (!title) {
      return NextResponse.json({ error: 'Notification title is required' }, { status: 400 });
    }

    const result = await processNotificationFanout({
      eventType: eventType || 'TASK_STATE_CHANGE',
      title,
      description: description || 'State updated in compliance workflow',
      entityName,
      recipient,
      channels,
      metadata,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
