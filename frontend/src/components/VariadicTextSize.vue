<template>
  <Title v-if="prop.font_size == 'title'">
    <slot></slot>
  </Title>
  <Heading v-else-if="prop.font_size == 'heading'">
    <slot></slot>
  </Heading>
  <SubHeading v-else-if="prop.font_size == 'subheading'">
    <slot></slot>
  </SubHeading>
  <Text v-else-if="prop.font_size == 'text'">
    <slot></slot>
  </Text>
  <SmallText v-else>
    <slot></slot>
  </SmallText>
</template>

<script setup lang="ts">
const prop = defineProps({
  font_size: {
    type: String,
    default: 'subheading',
    validator(val: string) {
      return ["title", "heading", "subheading", "text", "smalltext"].includes(val);
    }
  }
})
</script>
