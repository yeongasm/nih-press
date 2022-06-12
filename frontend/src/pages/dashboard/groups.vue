<template>
  <PopupOverlay v-if="popUpMode != 'none'" @on-exit="popUpMode = 'none'; groupName = ''; resetCategoryParam()">
    <div p-3>
      <div>
        <div v-if="popUpMode == 'create_group' || popUpMode == 'edit_group'" flex flex-col justify-center items-start w-96 mb-3>
          <Input w-full title="New Group Name" :default="groupName" @on-input="groupName = $event"/>
        </div>
        <div v-else flex flex-col justify-center items-start mb-3 class="w-[500px]">
          <div flex justify-between items-center w-full mb-2>
            <Input class="w-[45%]" title="New Category Key" :default="category.key" @on-input="category.key = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
            <div class="w-[45%]">
              <SubHeading>Type</SubHeading>
              <v-select w-full :options="['bool', 'int', 'float', 'string']" v-model="category.type" />
            </div>
          </div>
          <Input w-full mb-2 title="Value" :default="category.value" @on-input="category.value = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
          <div w-full mb-2>
            <SubHeading>Group</SubHeading>
            <v-select w-full :options="groupSelectionOptions" v-model="selectedGroup" />
          </div>
        </div>
      </div>
      <div flex justify-end items-center w-full>
        <Button
          bg-rose-400 hover:bg-rose-300 w-15 mr-2
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2); border-radius: 0.5rem"
          @on-click="buttonConfigs[popUpMode].on_cancel"
        >
          Cancel
        </Button>
        <Button
          bg-green-400 hover:bg-green-300 w-15
          class="transition"
          font_size="smalltext"
          style="padding: calc(1rem / 2);  border-radius: 0.5rem"
          :enable="buttonConfigs[popUpMode].enable_if"
          :listen_to_enter="true"
          @on-click="buttonConfigs[popUpMode].on_submit"
        >
          <span v-if="!showSpinner">Save</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
    </div>
    </div>
  </PopupOverlay>

  <div flex flex-row flex-wrap justify-start items-start w-full>
    <div mx-5 class="w-2/5">
      <Title>Groups</Title>
      <SectionBody>
        <Text>Groups, as the name suggests help group categories so they can be accessed easier. Groups help associate categories to a specific topic, discussion or feature. You can add, edit or remove groups.</Text>
        <div mt-4>
          <div flex items-center justify-end mt-1 mb-2>
            <Button
              bg-blue-400 hover:bg-blue-300
              class="transition"
              font_size="smalltext"
              style="padding: calc(1rem / 2); border-radius: 0.5rem"
              @on-click="popUpMode = 'create_group'"
            >
              Create Group
            </Button>
          </div>
          <Table
            v-if="groupStore.userGroups.length"
            :columns="['name', 'created_at', 'edited_at', 'action']"
            :alias="{ name: 'Group', created_at: 'Created At', edited_at: 'Edited At', action: 'Action' }"
            :configuration="{
              created_at: {
                type: 'date',
                format: 'dddd DD/MM/YYYY - HH:mm:ss'
              },
              edited_at: {
                type: 'date',
                format: 'dddd DD/MM/YYYY - HH:mm:ss'
              },
              action: {
                type: 'button',
                list: [
                  {
                    display: 'edit',
                    callback: editGroupCb,
                    secondary_color: '#fff',
                    main_color: '#54b95c'
                  },
                  {
                    display: 'delete',
                    callback: deleteGroupCb,
                    secondary_color: '#fff',
                    main_color: '#c33a49'
                  }
                ]
              }
            }"
            :data="groupStore.userGroups"
          />
        </div>
      </SectionBody>
    </div>

    <div class="w-2/5">
      <Title>Categories</Title>
      <SectionBody>
        <Text>Categories are like tags, you tag contents from your website to make them more accessible. They can also be linked to groups. You can add, edit or remove groups.</Text>
        <div mt-4>
          <div flex items-center justify-end mt-1 mb-2>
            <Button
              bg-blue-400 hover:bg-blue-300
              class="transition"
              font_size="smalltext"
              style="padding: calc(1rem / 2); border-radius: 0.5rem"
              :enable="groupStore.userGroups.length ? true : false"
              @on-click="popUpMode = 'create_category'"
            >
              Create Category
            </Button>
          </div>
          <Table
            v-if="categoryStore.userCategories.length"
            :columns="['key', 'value', 'type', 'group', 'created_at', 'edited_at', 'action']"
            :alias="{ key: 'Key', value: 'Value', type: 'Type', group: 'Group', created_at: 'Created At', edited_at: 'Edited At', action: 'Action' }"
            :configuration="{
              group: {
                type: 'custom',
                display: (category: any) => { return category?.group?.name },
              },
              created_at: {
                type: 'date',
                format: 'dddd DD/MM/YYYY - HH:mm:ss'
              },
              edited_at: {
                type: 'date',
                format: 'dddd DD/MM/YYYY - HH:mm:ss'
              },
              action: {
                type: 'button',
                list: [
                  {
                    display: 'edit',
                    callback: editCategoryCb,
                    secondary_color: '#fff',
                    main_color: '#54b95c'
                  },
                  {
                    display: 'delete',
                    callback: deleteCategoryCb,
                    secondary_color: '#fff',
                    main_color: '#c33a49'
                  }
                ]
              }
            }"
            :data="categoryStore.userCategories"
          />
        </div>
      </SectionBody>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue-select/dist/vue-select.css';
import { useGroupsStore } from '@/store/groups.store';
import { useCategoriesStore } from '@/store/categories.store';
const groupStore = useGroupsStore();
const categoryStore = useCategoriesStore();

groupStore.getGroups();
categoryStore.getCategories();

type PopupOpenMode = 'none' | 'create_group' | 'edit_group' | 'create_category' | 'edit_category';

const selectedGroup = ref(groupStore.userGroups.length ? groupStore.userGroups[0].name : "");
const selectedId = ref(-1);
const groupName = ref("");
const popUpMode = ref<PopupOpenMode>("none");
const showSpinner = ref(0);
const category = reactive({
  key: "",
  value: "",
  type: "bool"
});

const editCategoryOnClick = (inCategory: any) => {

  const group: any = inCategory.group;

  selectedId.value = inCategory.id;

  category.key = inCategory.key;
  category.value = inCategory.value;
  category.type = inCategory.type;
  selectedGroup.value = group.name;

  popUpMode.value = 'edit_category';
};

const editGroupCb       = (group: any) => { selectedId.value = group.id; popUpMode.value = 'edit_group'; };
const deleteGroupCb     = (group: any) => groupStore.deleteGroup(group.id);
const editCategoryCb    = (category: any) => { editCategoryOnClick(category); };
const deleteCategoryCb  = (category: any) => categoryStore.deleteCategory(category.id);

const resetCategoryParam = () => {
  category.key = "";
  category.value = "";
  category.type = "bool";
  selectedGroup.value = groupStore.userGroups.length ? groupStore.userGroups[0].name : "";
  popUpMode.value = 'none';
};

const groupSelectionOptions = computed(() => Array.from(groupStore.userGroups, (group: any) => group.name));

const buttonConfigs = reactive({
  'create_group': {
    enable_if: computed(() => { return groupName.value.length ? true : false }),
    on_cancel: () => {
      groupName.value = "";
      popUpMode.value = 'none';
    },
    on_submit: () => {
      showSpinner.value = 1;
      groupStore.newGroup(groupName.value)
      .then(() => {
        groupName.value = "";
        showSpinner.value = 0;
        popUpMode.value = 'none';
      });
    }
  },
  'edit_group': {
    enable_if: computed(() => { return groupName.value.length ? true : false }),
    on_cancel: () => {
      groupName.value = "";
      popUpMode.value = 'none';
    },
    on_submit: () => {
      showSpinner.value = 1;
      groupStore.editGroup(groupName.value, selectedId.value)
      .then(() => {
        selectedId.value = -1;
        groupName.value = "";
        showSpinner.value = 0;
        popUpMode.value = 'none';
      });
    }
  },
  'create_category': {
    enable_if: computed(() => {
      return category.key.length && category.value.length && category.type.length && selectedGroup.value.length;
    }),
    on_cancel: () => resetCategoryParam(),
    on_submit: () => {
      showSpinner.value = 1;
      categoryStore.newCategory(category.key, category.value, category.type, selectedGroup.value)
      .then(() => {
        resetCategoryParam();
        selectedId.value = -1;
        showSpinner.value = 0;
      });
    }
  },
  'edit_category': {
    enable_if: computed(() => {
      const allFilled: boolean = (category.key.length && category.value.length && category.type.length && selectedGroup.value.length) ? true : false;

      if (!allFilled)
        return false;

      let hasChange: boolean = false;

      const editingCategory = categoryStore.userCategories[categoryStore.userCategories.findIndex((category: any) => category.id == selectedId.value)];

      hasChange = ((editingCategory.key != category.key) || (editingCategory.value != category.value) || (editingCategory.type != category.type) || (editingCategory.group.name != selectedGroup.value) ? true : false);

      return hasChange;
    }),
    on_cancel: () => resetCategoryParam(),
    on_submit: () => {
      showSpinner.value = 1;
      categoryStore.editCategory(category.key, category.value, category.type, selectedGroup.value, selectedId.value)
      .then(() => {
        resetCategoryParam();
        selectedId.value = -1;
        showSpinner.value = 0;
      });
    }
  }
});

</script>

<style scoped>
.transition {
  transition: background-color 0.3s ease-in-out;
}
</style>
