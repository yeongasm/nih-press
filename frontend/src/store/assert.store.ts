import { defineStore } from 'pinia';
import { getRandomInt } from '@/util/util';

export interface IAssertion {
  id: number,
  msg: string,
  type: 'success' | 'neutral' | 'warning' | 'error',
  time: Date
};

export const useAssertStore = defineStore("assert", {
  state: () => ({
    assertions: [] as IAssertion[]
  }),
  getters: {
    asserts: (state) => state.assertions
  },
  actions: {

    removeAll() {
      this.assertions = [];
    },

    popAssert(id: number) {
      this.assertions.splice(this.assertions.findIndex((element: IAssertion) => element.id == id), 1);
    }

  }
});

export const $assert = (msg: string, type: 'success' | 'neutral' | 'warning' | 'error' = 'success') => {
  useAssertStore().$patch((state) => {
    state.assertions.push({ msg: msg, type: type, time: new Date(), id: getRandomInt() });
    // // We don't need all the assertions, most recent 5 will do.
    // if (state.assertions.length >= 5) {
    //   state.assertions.pop();
    // }
  });
};
