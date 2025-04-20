import { randomUUID as uuid } from 'crypto';

function makeAssignmentList() {
  const assignmentList = {};
  const assignments = {};

  const exampleAssignments = [
    {
      title: 'UML Class Diagram',
      subject: 'Application Modeling & Design',
      dueInDays: 1,
      description: 'Design a class diagram for the student course registration system.',
      completed: false,
    },
    {
      title: 'Python Loops Practice',
      subject: 'Intro to Python for Info Sys',
      dueInDays: 3,
      description: 'Practice loops, conditionals, and functions.',
      completed: false,
    },
    {
      title: 'Dev Environment Setup',
      subject: 'Application Engineer & Dev',
      dueInDays: -1,
      description: 'Complete initial dev environment and run the hello world project.',
      completed: true,
    },
    {
      title: 'Unit Test with Jest',
      subject: 'Lab for Application Engineer & Dev',
      dueInDays: 5,
      description: 'Write unit tests for basic calculator functions.',
      completed: false,
    },
    {
      title: 'CSS Grid & Flexbox',
      subject: 'Web Development Tools & Methods',
      dueInDays: 2,
      description: 'Create a responsive layout using both Grid and Flexbox.',
      completed: false,
    },
    {
      title: 'LLM API Integration',
      subject: 'Adv Techniques With LLM',
      dueInDays: -3,
      description: 'Use OpenAI API to generate summaries from blog articles.',
      completed: true,
    },
  ];

  exampleAssignments.forEach((item) => {
    const id = uuid();
    const dueDate = new Date(Date.now() + item.dueInDays * 86400000)
      .toISOString()
      .split('T')[0];
    assignments[id] = {
      id,
      title: item.title,
      subject: item.subject,
      dueDate,
      description: item.description,
      completed: item.completed,
      createdAt: new Date().toISOString(),
    };
  });

  assignmentList.contains = function contains(id) {
    return !!assignments[id];
  };

  assignmentList.getAssignments = function getAssignments() {
    return assignments;
  };

  assignmentList.getFilteredAssignments = function getFilteredAssignments(status, subject, sort) {
    let filteredAssignments = { ...assignments };

    if (status) {
      const isCompleted = status === 'completed';
      filteredAssignments = Object.fromEntries(
        Object.entries(filteredAssignments).filter(([_, a]) => a.completed === isCompleted)
      );
    }

    if (subject) {
      filteredAssignments = Object.fromEntries(
        Object.entries(filteredAssignments).filter(([_, a]) => a.subject === subject)
      );
    }

    if (sort === 'dueDate') {
      const arr = Object.entries(filteredAssignments);
      arr.sort((a, b) => new Date(a[1].dueDate) - new Date(b[1].dueDate));
      filteredAssignments = Object.fromEntries(arr);
    }

    return filteredAssignments;
  };

  assignmentList.addAssignment = function addAssignment(title, subject, dueDate, description) {
    const id = uuid();
    assignments[id] = {
      id,
      title,
      subject: subject || '',
      dueDate,
      description: description || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    return id;
  };

  assignmentList.getAssignment = function getAssignment(id) {
    return assignments[id];
  };

  assignmentList.updateAssignment = function updateAssignment(id, updates) {
    const a = assignments[id];
    if (updates.title !== undefined) a.title = updates.title;
    if (updates.subject !== undefined) a.subject = updates.subject;
    if (updates.dueDate !== undefined) a.dueDate = updates.dueDate;
    if (updates.description !== undefined) a.description = updates.description;
    if (updates.completed !== undefined) a.completed = updates.completed;
    a.updatedAt = new Date().toISOString();
  };

  assignmentList.deleteAssignment = function deleteAssignment(id) {
    delete assignments[id];
  };

  assignmentList.getStats = function getStats() {
    const total = Object.keys(assignments).length;
    const completed = Object.values(assignments).filter((a) => a.completed).length;
    const pending = total - completed;

    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    const upcomingDue = Object.values(assignments).filter((a) => {
      if (a.completed) return false;
      const dueDate = new Date(a.dueDate);
      return dueDate >= today && dueDate <= threeDaysLater;
    }).length;

    const overdue = Object.values(assignments).filter((a) => {
      if (a.completed) return false;
      const dueDate = new Date(a.dueDate);
      return dueDate < today;
    }).length;

    const subjectStats = {};
    Object.values(assignments).forEach((a) => {
      const subject = a.subject || 'Uncategorized';
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, completed: 0 };
      }
      subjectStats[subject].total++;
      if (a.completed) {
        subjectStats[subject].completed++;
      }
    });

    return {
      total,
      completed,
      pending,
      upcomingDue,
      overdue,
      completionRate: total ? ((completed / total) * 100).toFixed(1) : 0,
      subjectStats,
    };
  };

  return assignmentList;
}

export default {
  makeAssignmentList,
};
