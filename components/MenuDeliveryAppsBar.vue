<template>
  <template v-if="hasPlatforms && !isPreview">
    <a
      v-for="platform in validPlatforms"
      :key="platform.id"
      :href="platform.url"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 transition-all hover:scale-105"
      :style="buttonStyle"
      :title="`Pedir por ${platform.name}`"
      :aria-label="`Pedir por ${platform.name}`"
    >
      <img
        v-if="platform.logo"
        :src="platform.logo"
        :alt="platform.name"
        loading="lazy"
        class="h-5 w-5 object-contain"
      />
      <span v-else class="text-xs font-medium">{{ platform.name }}</span>
    </a>
  </template>
  <template v-else-if="hasPlatforms">
    <div
      v-for="platform in validPlatforms"
      :key="`preview-${platform.id}`"
      class="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 opacity-70"
      :style="buttonStyle"
      :title="platform.name"
      :aria-label="platform.name"
    >
      <img
        v-if="platform.logo"
        :src="platform.logo"
        :alt="platform.name"
        loading="lazy"
        class="h-5 w-5 object-contain"
      />
      <span v-else class="text-xs font-medium">{{ platform.name }}</span>
    </div>
  </template>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  platforms: { type: Array, default: () => [] },
  textColor: { type: String, default: '#1f2937' },
  isPreview: { type: Boolean, default: false },
})

const validPlatforms = computed(() =>
  (props.platforms || []).filter((platform) => platform?.id && platform?.name && platform?.url)
)
const hasPlatforms = computed(() => validPlatforms.value.length > 0)
const buttonStyle = computed(() => ({
  borderColor: `${props.textColor}30`,
  backgroundColor: `${props.textColor}08`,
  color: props.textColor,
}))
</script>
