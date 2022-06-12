<template>
  <div>
    <table w-full border-spacing-0>
      <tr bg-gray-700 border-separate>
        <th
          v-for="column in props.columns"
          color-white p-2
        >
          {{ columnTitle(column) }}
        </th>
      </tr>
        <tr v-for="row in props.data" :key="row">
          <td
            v-for="column in props.columns"
            text-center text-xs
          >
            <span v-if="props.configuration[column]">
              <span v-if="props.configuration[column].type == 'date'" text-gray-400>{{ formatDateAs(row[column].value, props.configuration[column].format) }}</span>
              <div v-else-if="props.configuration[column].type == 'button'">
                <div v-for="button in props.configuration[column].list" @click="button.callback(row)">
                  <div
                    p-1 rounded cursor-pointer border-1
                    class="m-[2px]"
                    :class="`hover:opacity-75`"
                    :style="{ 'border-color':button.main_color, 'color': button.main_color, 'background-color': button.secondary_color }"
                  >
                    {{ button.display }}
                  </div>
                </div>
              </div>
              <div v-else text-gray-400>
                {{ props.configuration[column].display(row) }}
              </div>
            </span>
            <span v-else text-gray-400>{{ row[column] }}</span>
          </td>
        </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { formatDateAs } from '@/util/util';

const props = defineProps([ 'columns', 'data', 'alias', 'configuration' ]);
const columnTitle = (key: string): string => {
  if (props.alias != undefined && props.alias[key] != undefined)
      return props.alias[key];
  return key;
};
</script>

<style scoped>
tr th:first-child {
  border-top-left-radius: 0.25rem;
  border: 1px solid #374151;
}
tr th:last-child {
  border-top-right-radius: 0.25rem;
  border: 1px solid #374151;
}
tr th {
  border-top: 1px solid #374151;
  border-bottom: 1px solid #374151;
}
tr:last-child td:first-child {
  border-bottom-left-radius: 0.25rem;
}
tr:last-child td:last-child {
  border-bottom-right-radius: 0.25rem;
}
tr td {
  border-bottom: 1px solid #cdcdcd;
  border-right: 1px solid #cdcdcd;
}
tr td:first-child {
  border-left: 1px solid #cdcdcd;
}
</style>

<style scoped>
.slide-down-fade-move,
.slide-down-fade-enter-active,
.slide-down-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-down-fade-enter-from,
.slide-down-fade-leave-to {
  transform: translateY(200px);
  opacity: 0;
}
</style>
