import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase-admin';

// Mark route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

// Get all tasks for a user
export async function GET(request: Request) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!auth || !db) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const { uid } = decodedToken;

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');

    const tasksRef = db.collection('tasks');
    let q = tasksRef.where('userId', '==', uid);
    
    if (goalId) {
      q = q.where('goalId', '==', goalId);
    }

    const querySnapshot = await q.get();
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// Create a new task
export async function POST(request: Request) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!auth || !db) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const { uid } = decodedToken;

    const body = await request.json();
    const { title, description, dueDate, goalId, priority } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create task in Firestore
    const tasksRef = db.collection('tasks');
    const newTask = await tasksRef.add({
      userId: uid,
      goalId,
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      taskId: newTask.id
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// Update a task
export async function PUT(request: Request) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!auth || !db) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const { uid } = decodedToken;

    const body = await request.json();
    const { taskId, ...updates } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Update task in Firestore
    const taskRef = db.collection('tasks').doc(taskId);
    await taskRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    // If task is completed and associated with a goal, update goal progress
    if (updates.status === 'completed' && updates.goalId) {
      const goalRef = db.collection('goals').doc(updates.goalId);
      const tasksQuery = db.collection('tasks')
        .where('goalId', '==', updates.goalId)
        .where('status', '==', 'completed');
      const completedTasks = await tasksQuery.get();
      const totalTasks = await db.collection('tasks')
        .where('goalId', '==', updates.goalId)
        .get();
      
      const progress = (completedTasks.size / totalTasks.size) * 100;
      await goalRef.update({
        progress,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// Delete a task
export async function DELETE(request: Request) {
  try {
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!auth || !db) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized' },
        { status: 500 }
      );
    }

    const decodedToken = await auth.verifySessionCookie(sessionCookie);
    const { uid } = decodedToken;

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Delete task from Firestore
    const taskRef = db.collection('tasks').doc(taskId);
    await taskRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 