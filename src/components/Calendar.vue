<template>
  <div id="calendar-wrapper" @wheel="handleScroll">
    <!-- Cabecera del calendario -->
    <div class="calendar-header">
      <button @click="prevMonth" class="nav-button">
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
            d="M5 12h14M5 12l4-4m-4 4 4 4"
          />
        </svg>
        Anterior
      </button>
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <button @click="nextMonth" class="nav-button">
        Siguiente
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
            d="M19 12H5m14 0-4 4m4-4-4-4"
          />
        </svg>
      </button>
    </div>

    <!-- Días de la semana -->
    <div class="calendar-grid calendar-days">
      <span v-for="day in weekDays" :key="day" class="day-name">
        {{ day }}
      </span>
    </div>

    <!-- Días del mes -->
    <div class="calendar-grid">
      <!-- Días vacíos al inicio -->
      <span
        v-for="empty in emptyDays"
        :key="'empty-' + empty"
        class="day-empty"
      ></span>

      <!-- Días del mes actual -->
      <span
        v-for="day in daysInMonth"
        :key="'day-' + day"
        :class="[
          'day',
          isToday(day) ? 'day-today' : '',
          hasTasks(day) ? 'day-with-tasks' : '',
        ]"
        @click="openModal(day)"
      >
        {{ day }}
        <span
          v-if="hasTasks(day)"
          :class="[
            'task-indicator',
            isToday(day) ? 'task-indicator-today' : '',
          ]"
        ></span>
      </span>

      <!-- Días vacíos al final -->
      <span
        v-for="empty in trailingDays"
        :key="'trailing-' + empty"
        class="day-empty"
      ></span>
    </div>

    <!-- Modal para tareas -->
    <TaskModal
      v-if="modalOpen"
      :isOpen="modalOpen"
      :date="selectedDate"
      :tasks="tasksForSelectedDate"
      @updateTasks="updateTasks"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import TaskModal from './TaskModal.vue';
// @ts-ignore
import anime from 'animejs';

export default defineComponent({
  name: 'Calendar',
  components: { TaskModal },
  setup() {
    const today = new Date();
    const currentYear = ref(today.getFullYear());
    const currentMonth = ref(today.getMonth());
    let isScrolling = false; // Evitar cambios excesivos

    // Estado para tareas
    const tasks = ref<Record<string, string[]>>({});
    const selectedDate = ref<string | null>(null);
    const modalOpen = ref(false);

    // Nombres de los meses y días de la semana
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // Días en el mes actual
    const daysInMonth = computed(() => {
      return Array.from(
        {
          length: new Date(
            currentYear.value,
            currentMonth.value + 1,
            0
          ).getDate(),
        },
        (_, i) => i + 1
      );
    });

    // Día de la semana actual
    const isToday = (day: number) => {
      const today = new Date();
      return (
        day === today.getDate() &&
        currentMonth.value === today.getMonth() &&
        currentYear.value === today.getFullYear()
      );
    };

    // Verificar si un día tiene tareas
    const hasTasks = (day: number) => {
      const dateKey = getDateKey(day);
      return tasks.value[dateKey] && tasks.value[dateKey].length > 0;
    };

    // Generar clave única para una fecha
    const getDateKey = (day: number) => {
      return `${currentYear.value}-${String(currentMonth.value + 1).padStart(
        2,
        '0'
      )}-${String(day).padStart(2, '0')}`;
    };

    // Día de la semana del primer día del mes
    const firstDayOfMonth = computed(() => {
      const day = new Date(currentYear.value, currentMonth.value, 1).getDay();
      return day === 0 ? 6 : day - 1; // Ajustar para que Lunes sea 0
    });

    // Días vacíos al inicio
    const emptyDays = computed(() => firstDayOfMonth.value);

    // Días vacíos al final
    const trailingDays = computed(() => {
      const totalDays = emptyDays.value + daysInMonth.value.length;
      return totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    });

    // Cambiar mes
    const nextMonth = () => {
      // Animar la salida de los días del calendario
      anime({
        targets: '.calendar-grid .day, .calendar-grid .day-empty',
        opacity: [1, 0],
        translateX: [0, -50],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
          // Cambiar el mes después de la animación de salida
          if (currentMonth.value === 11) {
            currentMonth.value = 0;
            currentYear.value += 1;
          } else {
            currentMonth.value += 1;
          }

          // Animar la entrada de los días del nuevo mes
          anime({
            targets: '.calendar-grid .day, .calendar-grid .day-empty',
            opacity: [0, 1],
            translateX: [50, 0],
            duration: 300,
            easing: 'easeOutQuad',
          });
        },
      });
    };

    const prevMonth = () => {
      // Animar la salida de los días del calendario
      anime({
        targets: '.calendar-grid .day, .calendar-grid .day-empty',
        opacity: [1, 0],
        translateX: [0, 50],
        duration: 300,
        easing: 'easeInQuad',
        complete: () => {
          // Cambiar el mes después de la animación de salida
          if (currentMonth.value === 0) {
            currentMonth.value = 11;
            currentYear.value -= 1;
          } else {
            currentMonth.value -= 1;
          }

          // Animar la entrada de los días del nuevo mes
          anime({
            targets: '.calendar-grid .day, .calendar-grid .day-empty',
            opacity: [0, 1],
            translateX: [-50, 0],
            duration: 300,
            easing: 'easeOutQuad',
          });
        },
      });
    };

    // Manejar el desplazamiento
    const handleScroll = (event: WheelEvent) => {
      if (isScrolling) return;

      if (event.deltaY > 0) {
        // Desplazamiento hacia abajo (siguiente mes)
        nextMonth();
      } else if (event.deltaY < 0) {
        // Desplazamiento hacia arriba (mes anterior)
        prevMonth();
      }

      // Evitar cambios excesivos
      isScrolling = true;
      setTimeout(() => {
        isScrolling = false;
      }, 300); // Tiempo en milisegundos
    };

    // Cargar tareas desde LocalStorage
    const loadTasksFromLocalStorage = () => {
      const savedTasks = localStorage.getItem('calendarTasks');
      if (savedTasks) {
        tasks.value = JSON.parse(savedTasks);
      }
    };

    // Guardar tareas en LocalStorage
    const saveTasksToLocalStorage = () => {
      localStorage.setItem('calendarTasks', JSON.stringify(tasks.value));
    };

    // Abrir el modal
    const openModal = (day: number) => {
      selectedDate.value = getDateKey(day);
      modalOpen.value = true;
    };

    // Cerrar el modal
    const closeModal = () => {
      modalOpen.value = false;
    };

    // Actualizar las tareas
    const updateTasks = (updatedTasks: string[]) => {
      if (selectedDate.value) {
        tasks.value[selectedDate.value] = updatedTasks;
      }
    };

    // Computed para obtener tareas de la fecha seleccionada
    const tasksForSelectedDate = computed(() => {
      return selectedDate.value ? tasks.value[selectedDate.value] || [] : [];
    });

    // Watch para sincronizar tareas con LocalStorage
    watch(tasks, saveTasksToLocalStorage, { deep: true });

    // Cargar las tareas al montar el componente
    onMounted(loadTasksFromLocalStorage);

    return {
      currentYear,
      currentMonth,
      currentMonthName: computed(() => monthNames[currentMonth.value]),
      weekDays,
      daysInMonth,
      emptyDays,
      trailingDays,
      isToday,
      hasTasks,
      nextMonth,
      prevMonth,
      openModal,
      closeModal,
      updateTasks,
      modalOpen,
      selectedDate,
      tasksForSelectedDate,
      handleScroll,
    };
  },
});
</script>

<style scoped>
/* Contenedor del calendario */
#calendar-wrapper {
  max-width: 50%;
  max-height: 100vh;
  margin: 0 auto;
  padding: 1rem;
  color: #eae0d5;
  display: flex;
  flex-direction: column; /* Organizar cabecera y grid en columnas */
  gap: 2rem; /* Espaciado entre cabecera y grid */
}

/* Cabecera del calendario */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-button {
  background: transparent;
  border: none;
  font-size: 1rem;
  color: #4ade80;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: calc(0.5rem + 2px);
}

.nav-button:hover {
  color: #4ade80;
  border: 2px solid #4ade80;
  border-radius: 7.5px;
  padding: 0.5rem;
}

/* Días de la semana */
.calendar-days {
  margin-bottom: 0.5rem;
}

.day-name {
  font-weight: bold;
  text-align: center;
}

/* Cuadrícula del calendario */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Siete columnas para los días */
  place-items: center;
  gap: 0.5rem;
  flex-grow: 1; /* Permitir que el grid ocupe todo el espacio disponible */
}

.day,
.day-empty {
  aspect-ratio: 1 / 1; /* Proporción 1:1 para hacer un círculo */
  width: 50%; /* Ocupar el espacio disponible en la celda */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* Días del mes actual */
.day {
  color: #eae0d5;
  cursor: pointer;
  font-size: 1rem;
}

.day:hover {
  background: #4ade80;
  color: #1f2937;
}

/* Días vacíos */
.day-empty {
  background: transparent;
}

.day-today {
  background: #4ade80;
  color: #1f2937 !important;
  font-weight: bold;
  border: 2px solid #a7f3d0; /* Asegúrate de que el borde no altere el tamaño */
  box-sizing: border-box; /* Incluye el borde dentro de las dimensiones */
}

.day-with-tasks {
  position: relative;
  color: #4ade80;
}

.task-indicator {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0.4rem;
  height: 0.4rem;
  background-color: #4ade80;
  border-radius: 50%;
}

/* Indicador de tareas para el día actual */
.task-indicator-today {
  background-color: #000; /* Color negro para el día actual */
}

@media screen and (max-width: 1440px) {
  #calendar-wrapper {
    max-width: 60%;
  }

  .day,
  .day-empty {
    width: 60%;
  }
}

@media screen and (max-width: 1024px) {
  #calendar-wrapper {
    max-width: 70%;
  }

  .day,
  .day-empty {
    width: 70%;
  }
}

@media screen and (max-width: 768px) {
  #calendar-wrapper {
    max-width: 85%;
  }

  .day,
  .day-empty {
    width: 80%;
  }

  .task-indicator {
    position: absolute;
    bottom: 0.01rem;
    left: 50%;
    transform: translateX(-50%);
    width: 0.4rem;
    height: 0.4rem;
    background-color: #4ade80;
    border-radius: 50%;
  }
}

@media screen and (max-width: 480px) {
  #calendar-wrapper {
    max-width: 95%;
  }

  .day,
  .day-empty {
    width: 90%;
  }
}
</style>
