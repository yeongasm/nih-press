<template>
  <PopupOverlay v-if="popUpMode != 'none'" @on-exit="popUpMode = 'none'; groupName = ''; resetTagParam()">
    <div p-3>
      <div>
        <div v-if="popUpMode == 'create_group' || popUpMode == 'edit_group'" flex flex-col justify-center items-start w-96 mb-3>
          <Title mb-5>Create New Group</Title>
          <Input w-full title="Name" :default="groupName" @on-input="groupName = $event"/>
        </div>
        <div v-else flex flex-col justify-center items-start mb-3 class="w-[500px]">
          <Title mb-5>Create New Tag</Title>
          <!-- <div flex justify-between items-center w-full mb-2> -->
          <Input w-full title="Key" :default="tag.key" @on-input="tag.key = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
          <!-- </div> -->
          <Input w-full mb-2 title="Value" :default="tag.value" @on-input="tag.value = $event" input_style="padding: 1px; padding-left: 1rem; padding-right: 1rem"/>
          <div flex justify-start items-center w-full mb-2>
            <div w="3/5">
              <SubHeading>Group</SubHeading>
              <v-select
                w-full
                label="name"
                :reduce="(group: any) => group.id"
                :options="groupSelectionOptions"
                v-model="selectedGroup"
              />
            </div>
            <div flex flex-col justify-center items-center flex-grow>
              <SubHeading mb-1>Visible</SubHeading>
              <Toggle v-model="tag.visible" />
            </div>
            <!-- <div flex flex-col justify-center items-center flex-grow>
              <SubHeading mb-1>Is Primary</SubHeading>
              <Toggle v-model="tag.isPrimary" />
            </div> -->
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
          <span v-if="!isSubmitting">Save</span>
          <div v-else class="w-[40px] h-[24px] spinner">
            <EllipsisSpinner background="#fff" :x="8" :y="8" />
          </div>
        </Button>
      </div>
    </div>
  </PopupOverlay>

  <ConfirmDialog v-if="showConfirmDialog" @on-positive="permaDelete" @on-negative="onDialogClose">
    <Title mb-5>Warning</Title>
    <div flex flex-row justify-start items-center mb-5>
      Are you sure you want to permanently delete {{ deletingItemConfirmText }}.
    </div>
  </ConfirmDialog>

  <div w-full grid grid-cols-2 gap-5>
    <div>
      <Title mb-4>Groups</Title>
      <SectionBody>
        <Text>Groups, as the name suggests help group tags so they can be accessed easier. Groups help associate tags to a specific topic, discussion or feature. You can add, edit or remove groups.</Text>
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

    <div>
      <Title mb-4>Tags</Title>
      <SectionBody>
        <Text>Tags are like signboards, you tag contents from your website to make them more accessible. They can also be linked to groups. You can add, edit or remove groups.</Text>
        <div mt-4>
          <div flex items-center justify-end mt-1 mb-2>
            <Button
              bg-blue-400 hover:bg-blue-300
              class="transition"
              font_size="smalltext"
              style="padding: calc(1rem / 2); border-radius: 0.5rem"
              :enable="groupStore.userGroups.length ? true : false"
              @on-click="popUpMode = 'create_tag'"
            >
              Create Tag
            </Button>
          </div>
          <Table
            v-if="tagStore.userTags.length"
            :columns="['key', 'value', 'group', 'hidden', 'created_at', 'edited_at', 'action']"
            :alias="{ key: 'Key', value: 'Value', hidden: 'Visibility', group: 'Group', created_at: 'Created At', edited_at: 'Edited At', action: 'Action' }"
            :configuration="{
              hidden: {
                type: 'custom',
                display: (tag: any) => tag.hidden ? 'Hidden' : 'Visible'
              },
              group: {
                type: 'custom',
                display: (tag: any) => { return tag?.group?.name },
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
                    callback: editTagCb,
                    secondary_color: '#fff',
                    main_color: '#54b95c'
                  },
                  {
                    display: 'delete',
                    callback: deleteTagCb,
                    secondary_color: '#fff',
                    main_color: '#c33a49'
                  }
                ]
              }
            }"
            :data="tagStore.userTags"
          />
        </div>
      </SectionBody>
    </div>
  </div>
</template>

<script setup lang="ts">
import Toggle from '@vueform/toggle';
import { useGroupsStore } from '@/store/groups.store';
import { useTagStore } from '@/store/tags.store';

type PopupOpenMode  = 'none' | 'create_group' | 'edit_group' | 'create_tag' | 'edit_tag';
type DeletingItem   = 'groups' | 'tags';

const deletingItem = ref<DeletingItem>('groups');
const showConfirmDialog = ref(false);
const selectedGroup = ref<number>(0);
const selectedId = ref(-1);
const groupName = ref("");
const popUpMode = ref<PopupOpenMode>("none");
const isSubmitting = ref<boolean>(false);
const tag = reactive({
  key: "",
  value: "",
  visible: true
});

const groupStore = useGroupsStore();
const tagStore = useTagStore();

groupStore.getGroups().then(() => {
  groupStore.userGroups.length && (selectedGroup.value = groupStore.userGroups[0].id);
});
tagStore.getTags();

const editTagOnClick = (inTag: any) => {

  const group: any = inTag.group;

  selectedId.value = inTag.id;

  tag.key = inTag.key;
  tag.value = inTag.value;
  tag.visible = !inTag.hidden;
  selectedGroup.value = group.id;

  popUpMode.value = 'edit_tag';

};

const editGroupCb       = (group: any) => { selectedId.value = group.id; popUpMode.value = 'edit_group'; };
const deleteGroupCb     = (group: any) => { deletingItem.value = 'groups'; selectedId.value = group.id; showConfirmDialog.value = true; };
const editTagCb    = (tag: any) => { editTagOnClick(tag); };
const deleteTagCb  = (tag: any) => { deletingItem.value = 'tags'; selectedId.value = tag.id; showConfirmDialog.value = true; }


const onDialogClose = () => {
  selectedId.value = -1;
  showConfirmDialog.value = false;
};
const permaDelete = () => {

  if (deletingItem.value == 'groups')
    groupStore.deleteGroup(selectedId.value);

  if (deletingItem.value == 'tags')
    tagStore.deleteTag(selectedId.value);

  onDialogClose();
};

const resetTagParam = () => {
  tag.key = "";
  tag.value = "";
  tag.visible = true;
  selectedGroup.value = groupStore.userGroups[0].id;
  popUpMode.value = 'none';
};

const groupSelectionOptions = computed(() => Array.from(groupStore.userGroups));
const deletingItemConfirmText = computed(() => {
  let outputTxt : string = '';
  if (deletingItem.value == 'groups') {
    for (const group of groupStore.userGroups) {
      if (group.id == selectedId.value)
        outputTxt = `group with name [ ${group.name} ]`;
    }
  } else {
    for (const tag of tagStore.userTags) {
      if (tag.id == selectedId.value)
        outputTxt = `tag with key [ ${tag.key} ]`;
    }
  }
  return outputTxt;
});

const buttonConfigs = reactive({
  'create_group': {
    enable_if: computed(() => { return groupName.value.length ? true : false }),
    on_cancel: () => {
      groupName.value = "";
      popUpMode.value = 'none';
    },
    on_submit: () => {
      if (!isSubmitting.value) {
        isSubmitting.value = true;
        groupStore.newGroup(groupName.value)
        .then(() => {
          groupName.value = "";
          isSubmitting.value = false;
          popUpMode.value = 'none';
        });
      }
    }
  },
  'edit_group': {
    enable_if: computed(() => { return groupName.value.length ? true : false }),
    on_cancel: () => {
      groupName.value = "";
      popUpMode.value = 'none';
    },
    on_submit: () => {
      if (!isSubmitting.value) {
        isSubmitting.value = true;
        groupStore.editGroup(groupName.value, selectedId.value)
        .then(() => {
          selectedId.value = -1;
          groupName.value = "";
          isSubmitting.value = false;
          popUpMode.value = 'none';
        });
      }
    }
  },
  'create_tag': {
    enable_if: computed(() => {
      return tag.key.length && tag.value.length && (selectedGroup.value != 0);
    }),
    on_cancel: () => resetTagParam(),
    on_submit: () => {
      if (!isSubmitting.value) {
        isSubmitting.value = true;
        tagStore.newTag({
          key: tag.key, value: tag.value, visible: tag.visible, groupId: selectedGroup.value
        })
        .then(() => {
          resetTagParam();
          selectedId.value = -1;
          isSubmitting.value = false;
        });
      }
    }
  },
  'edit_tag': {
    enable_if: computed(() => {
      const allFilled: boolean = (tag.key.length && tag.value.length && (selectedGroup.value != 0)) ? true : false;

      if (!allFilled)
        return false;

      let hasChange: boolean = false;

      const editingTag = tagStore.userTags[tagStore.userTags.findIndex((tag: any) => tag.id == selectedId.value)];

      hasChange = ((editingTag.key != tag.key) || (editingTag.value != tag.value) || (editingTag.group.name != selectedGroup.value) || (editingTag.hidden != !tag.visible) ? true : false);

      return hasChange;
    }),
    on_cancel: () => resetTagParam(),
    on_submit: () => {
      if (!isSubmitting.value) {
        isSubmitting.value = true;
        const editingTag = tagStore.userTags[tagStore.userTags.findIndex((tag: any) => tag.id == selectedId.value)];
        const payload: any = {
          ...(tag.key   != editingTag.key && { key: tag.key }),
          ...(tag.value != editingTag.value && { value: tag.value }),
          ...(!tag.visible  != editingTag.hidden && { hidden: !tag.visible }),
          ...((selectedGroup.value != editingTag.group.id && selectedGroup.value != 0) && { group_id: selectedGroup.value })
        };
        tagStore.editTag(payload, selectedId.value)
        .then(() => {
          resetTagParam();
          selectedId.value = -1;
          isSubmitting.value = false;
        });
      }
    }
  }
});

</script>

<style src="@vueform/toggle/themes/default.css"></style>
<style scoped>
.transition {
  transition: background-color 0.3s ease-in-out;
}
</style>
