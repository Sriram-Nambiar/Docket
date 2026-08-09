import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { STATUTORY_TIMELINE_ITEMS } from '../../../lib/mockData';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { dueDate: 'asc' },
    });
    return NextResponse.json({ success: true, data: tasks, source: 'postgresql' });
  } catch (error) {
    console.warn('PostgreSQL query failed, returning fallback mock tasks:', error.message);
    return NextResponse.json({ success: true, data: STATUTORY_TIMELINE_ITEMS, source: 'fallback_mock' });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        category: body.category || 'General Compliance',
        entity: body.entity || 'Apex Technologies Pvt Ltd',
        section: body.section || '',
        act: body.act || '',
        dueDate: body.dueDate,
        status: body.status || 'NotStarted',
        accruedPenalty: body.accruedPenalty || 0,
        dailyRate: body.dailyRate || 0,
        whatsappAlert: body.whatsappAlert ?? true,
      },
    });

    return NextResponse.json({ success: true, data: newTask, source: 'postgresql' });
  } catch (error) {
    console.error('Failed to create task in PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedTask, source: 'postgresql' });
  } catch (error) {
    console.error('Failed to update task in PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
