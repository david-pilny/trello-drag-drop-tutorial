import { v4 as uuid } from 'uuid'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import boardData from '~/data/board.json'

export const useBoardStore = defineStore('boardStore', () => {
  const board = useStorage('board', boardData)

  const getTask = computed(() => {
    return (taskId: string) => {
      for (const column of board.value.columns) {
        const task = column.tasks.find((task) => task.id === taskId)
        if (task) return task
      }
    }
  })

  function addColumn(columnName: string) {
    board.value.columns.push({
      name: columnName,
      tasks: [],
    })
  }

  function deleteColumn(columnIndex: number) {
    board.value.columns.splice(columnIndex, 1)
  }

  function moveColumn({ fromColumnIndex, toColumnIndex }) {
    const column = board.value.columns.splice(fromColumnIndex, 1)[0]
    board.value.columns.splice(toColumnIndex, 0, column)
  }

  function addTask({ columnIndex, taskName }) {
    board.value.columns[columnIndex].tasks.push({
      id: uuid(),
      name: taskName,
      description: '',
    })
  }

  function deleteTask(taskId: string) {
    for (const column of board.value.columns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId)

      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1)
        return
      }
    }
  }

  function moveTask({
    fromTaskIndex,
    toTaskIndex,
    fromColumnIndex,
    toColumnIndex,
  }) {
    const task = board.value.columns[fromColumnIndex].tasks.splice(
      fromTaskIndex,
      1
    )[0]

    board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
  }

  return {
    board,
    addColumn,
    moveColumn,
    deleteColumn,
    addTask,
    moveTask,
    deleteTask,
    getTask,
  }
})
