<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <header class="modal-header">
        <h3>Tareas para el {{ formattedDate }}</h3>
        <button @click="closeModal" class="close-button">
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        </button>
      </header>

      <main class="modal-body">
        <ul class="task-list">
          <li v-for="(task, index) in tasks" :key="index" class="task-item">
            <span>{{ task }}</span>
            <button @click="removeTask(index)" class="remove-task">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </li>
        </ul>

        <div class="add-task">
          <input
            type="text"
            v-model="newTask"
            placeholder="Nueva tarea..."
            @keyup.enter="addTask"
          />
          <button @click="addTask">
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14m-7 7V5"
              />
            </svg>
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

export default defineComponent({
  name: 'TaskModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    date: {
      type: [String, null] as PropType<string | null>, // Tipo correcto
      required: false,
      default: null, // Valor por defecto es null
    },
    tasks: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ['updateTasks', 'close'],
  setup(props, { emit }) {
    const newTask = ref('');

    const addTask = () => {
      if (newTask.value.trim()) {
        emit('updateTasks', [...props.tasks, newTask.value.trim()]);
        newTask.value = '';
      }
    };

    const removeTask = (index: number) => {
      const updatedTasks = [...props.tasks];
      updatedTasks.splice(index, 1);
      emit('updateTasks', updatedTasks);
    };

    const closeModal = () => {
      emit('close');
    };

    const formattedDate = computed(() => {
      if (!props.date) return ''; // Manejo de null
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      };
      return new Date(props.date).toLocaleDateString('es-ES', options);
    });

    return {
      newTask,
      addTask,
      removeTask,
      closeModal,
      formattedDate,
    };
  },
});
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background: #1f2937;
  color: #eae0d5;
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: #eae0d5;
  cursor: pointer;
}

.close-button:hover {
  color: #f87171;
}

/* Task List */
.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #374151;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.remove-task {
  background: none;
  border: none;
  color: #f87171;
  cursor: pointer;
}

.remove-task:hover {
  color: #fca5a5;
}

/* Add Task */
.add-task {
  display: flex;
  gap: 0.5rem;
}

.add-task input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #374151;
  border-radius: 8px;
  background: #1f2937;
  color: #eae0d5;
  font-size: 1em;
}

.add-task input::placeholder {
  color: #9ca3af;
}

.add-task input:focus {
  outline: none;
  border-color: #4ade80;
}

.add-task button {
  padding: 0.5rem 1rem;
  background: #4ade80;
  border: none;
  border-radius: 8px;
  color: #1f2937;
  cursor: pointer;
}

.add-task button:hover {
  background: #86efac;
}
</style>
