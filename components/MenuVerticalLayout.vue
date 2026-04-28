<template>
  <div
    class="min-h-screen min-h-0 transition-all duration-300 ease-in-out"
    :style="{
      backgroundColor: backgroundColor,
      fontFamily: fontFamily,
      color: textColor,
      '--price-color': priceColor,
    }"
  >
    <div
      class="mx-auto flex min-h-screen min-h-0 max-w-2xl flex-col gap-10 px-5 py-10 sm:px-6"
    >
      <header class="space-y-6 pb-8 border-b" :style="{ borderColor: `${textColor}20` }" role="banner">
        <div class="flex w-full items-center gap-2">
          <div
            v-if="isPreview"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
            :style="{
              borderColor: `${textColor}30`,
              backgroundColor: `${textColor}10`,
              color: textColor,
            }"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Vista previa
          </div>
          <MenuBackToDiscoverLink v-else :color="textColor" />
          <div class="flex min-w-0 flex-1 items-center justify-end gap-3">
            <button
              v-if="isAuthenticated && !isPreview"
              type="button"
              @click="$emit('toggle-favorite')"
              :disabled="isLoadingFavorite"
              class="p-2 rounded-full transition-all hover:scale-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500/50"
              :style="{
                backgroundColor: isFavorite ? `${priceColor}20` : `${textColor}15`,
                color: isFavorite ? priceColor : textColor,
              }"
              :title="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
              :aria-pressed="isFavorite"
              :aria-label="isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
            >
              <svg
                v-if="isFavorite"
                class="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <div v-show="!isPreview || !editable" class="relative flex-1 max-w-xs">
              <label for="menu-search-vertical" class="sr-only">Buscar en el menú</label>
              <input
                id="menu-search-vertical"
                v-model="searchQuery"
                type="text"
                placeholder="Buscar en el menú..."
                class="w-full rounded-lg border px-4 py-2 text-sm outline-none transition-colors"
                :style="{
                  borderColor: `${textColor}30`,
                  backgroundColor: `${textColor}08`,
                  color: textColor,
                }"
                :disabled="isPreview"
                aria-label="Buscar en el menú"
              />
              <svg
                class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60"
                :style="{ color: textColor }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              v-if="business.openingHours"
              type="button"
              @click="showHoursModal = true"
              class="rounded-lg border p-2 transition-all hover:scale-110"
              :style="{
                borderColor: `${textColor}30`,
                backgroundColor: `${textColor}08`,
                color: textColor,
              }"
              :title="isOpenNow ? 'Abierto ahora' : 'Cerrado ahora'"
              :aria-label="isOpenNow ? 'Abierto ahora - Ver horarios' : 'Cerrado ahora - Ver horarios'"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <MenuDeliveryAppsBar
              :platforms="activeDeliveryPlatforms"
              :text-color="textColor"
              :is-preview="isPreview"
            />
            <div v-if="!isPreview" class="relative">
              <button
                type="button"
                @click="showShareMenu = !showShareMenu"
                class="rounded-lg border p-2 transition-colors"
                :style="{
                  borderColor: `${textColor}30`,
                  backgroundColor: `${textColor}08`,
                  color: textColor,
                }"
                title="Compartir menú"
                aria-label="Compartir menú"
                :aria-expanded="showShareMenu"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <ShareMenu
                v-model="showShareMenu"
                :backgroundColor="backgroundColor"
                :text-color="textColor"
                @share-whatsapp="$emit('share-whatsapp')"
                @share-facebook="$emit('share-facebook')"
                @copy-link="$emit('copy-link')"
                @export-pdf="$emit('export-pdf')"
              />
            </div>
          </div>
        </div>

        <div v-if="business.headerImageUrl" class="-mx-5 sm:-mx-6 rounded-2xl overflow-hidden shadow-lg relative">
          <img
            :src="business.headerImageUrl"
            :alt="`Imagen de ${business.name}`"
            loading="eager"
            class="w-full h-48 sm:h-64 object-cover"
          />
          <div
            v-if="business.headerImageOverlay"
            class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <h1
              class="text-3xl sm:text-4xl md:text-5xl tracking-tight leading-none text-white drop-shadow-lg px-4 text-center"
              :class="headingWeightClass"
            >
              {{ business.name }}
            </h1>
            <p v-if="business.description" class="text-base sm:text-lg opacity-90 leading-relaxed italic max-w-xl mx-auto mt-3 text-white drop-shadow-md px-4 text-center">
              {{ business.description }}
            </p>
          </div>
        </div>

        <div
          v-if="showHoursModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hours-modal-title-v"
          @click.self="showHoursModal = false"
        >
          <div
            class="rounded-2xl border p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            :style="{
              borderColor: `${textColor}30`,
              backgroundColor: backgroundColor,
              color: textColor,
            }"
            role="document"
            @click.stop
          >
            <div class="flex items-center justify-between mb-4">
              <h3 id="hours-modal-title-v" class="text-lg font-semibold">Horarios de atención</h3>
              <button
                type="button"
                class="p-1 rounded-lg hover:bg-black/10 transition-colors"
                aria-label="Cerrar modal de horarios"
                @click="showHoursModal = false"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="space-y-2 text-sm">
              <div
                v-for="(hours, day) in business.openingHours"
                :key="day"
                class="flex justify-between py-2 border-b"
                :style="{ borderColor: `${textColor}20` }"
              >
                <span class="capitalize font-medium">{{ day }}:</span>
                <span v-if="hours.closed" class="opacity-60">Cerrado</span>
                <span v-else>{{ hours.open }} - {{ hours.close }}</span>
              </div>
            </div>
            <div
              v-if="!isOpenNow"
              class="mt-4 text-center text-sm font-medium p-3 rounded-lg"
              :style="{ backgroundColor: `${priceColor}20`, color: priceColor }"
            >
              Actualmente cerrado
            </div>
          </div>
        </div>

        <div v-if="(!business.headerImageUrl || !business.headerImageOverlay) && !business.hideName" class="text-center space-y-4">
          <h1
            class="text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none"
            :class="headingWeightClass"
          >
            {{ business.name }}
          </h1>
          <p v-if="business.description" class="text-base sm:text-lg opacity-80 leading-relaxed italic max-w-xl mx-auto">
            {{ business.description }}
          </p>
        </div>

        <div class="pt-2">
          <MenuSocialLinksBar :business="business" :text-color="textColor" />
        </div>
      </header>

      <main
        v-if="editable && isPreview && false"
        class="flex-1 space-y-8 pb-12"
        role="main"
        id="panel-secciones-menu"
      >
        <div
          v-if="business.menuLayout && business.menuLayout !== 'vertical'"
          class="rounded-lg border px-3 py-2.5 text-xs leading-relaxed"
          :style="{
            borderColor: `${textColor}30`,
            backgroundColor: `${textColor}10`,
            color: textColor,
          }"
        >
          <span class="font-medium">Contenido del menú</span> se edita en esta vista (vertical). El menú público usa el diseño
          <span class="font-medium">{{ layoutLabelPublic }}</span> que elegiste abajo a la izquierda.
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-medium opacity-90" :style="{ color: textColor }">Secciones e ítems</p>
          <button
            type="button"
            @click="addSection"
            class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            :style="{
              borderColor: priceColor,
              color: priceColor,
              backgroundColor: `${priceColor}12`,
            }"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva sección
          </button>
        </div>

        <section
          v-for="(section, sectionIndex) in editorSections"
          :key="section.id"
          class="group/section space-y-4 rounded-xl border p-4"
          :style="{
            borderColor: `${textColor}20`,
            backgroundColor: `${textColor}04`,
          }"
        >
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="flex-shrink-0 p-1 opacity-60 transition-transform duration-200"
                :class="{ 'rotate-90': isSectionCollapsed(section.id) }"
                :aria-expanded="!isSectionCollapsed(section.id)"
                :aria-label="`Colapsar o expandir sección ${section.name || 'sin nombre'}`"
                @click="toggleSection(section.id)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <input
                v-model="section.name"
                type="text"
                placeholder="Nombre de la sección"
                class="min-w-0 flex-1 rounded-lg border px-3 py-2 text-base font-semibold outline-none"
                :style="{
                  borderColor: `${textColor}30`,
                  backgroundColor: backgroundColor,
                  color: textColor,
                }"
                @click.stop
              />
              <div class="ml-auto flex flex-wrap items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover/section:opacity-100 md:group-focus-within/section:opacity-100">
                <button
                  v-if="sectionIndex > 0"
                  type="button"
                  class="rounded border px-2 py-1 text-xs opacity-90 hover:opacity-100"
                  :style="{ borderColor: `${textColor}35`, color: textColor }"
                  title="Subir sección"
                  @click="moveSection(sectionIndex, -1)"
                >
                  ↑
                </button>
                <button
                  v-if="sectionIndex < editorSections.length - 1"
                  type="button"
                  class="rounded border px-2 py-1 text-xs opacity-90 hover:opacity-100"
                  :style="{ borderColor: `${textColor}35`, color: textColor }"
                  title="Bajar sección"
                  @click="moveSection(sectionIndex, 1)"
                >
                  ↓
                </button>
                <button
                  type="button"
                  class="rounded border border-red-500/50 px-2.5 py-1 text-xs text-red-600 dark:text-red-400"
                  @click="deleteSection(sectionIndex)"
                >
                  Eliminar
                </button>
              </div>
            </div>
            <label class="group/label inline-flex items-center gap-1 text-xs opacity-70" :for="`sec-desc-${section.id}`">
              <span>Descripción (opcional)</span>
              <svg class="h-3 w-3 opacity-0 transition-opacity group-hover/label:opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </label>
            <textarea
              :id="`sec-desc-${section.id}`"
              v-model="section.description"
              rows="2"
              placeholder="Descripción de la sección"
              class="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
              :style="{
                borderColor: `${textColor}30`,
                backgroundColor: backgroundColor,
                color: textColor,
              }"
            />
          </div>

          <div v-show="!isSectionCollapsed(section.id)" class="space-y-4 border-t pt-4" :style="{ borderColor: `${textColor}15` }">
            <div class="flex items-center justify-between gap-2">
              <span class="group/label inline-flex items-center gap-1 text-xs font-medium opacity-80" :style="{ color: textColor }">
                <span>Ítems</span>
                <svg class="h-3 w-3 opacity-0 transition-opacity group-hover/label:opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium"
                :style="{ borderColor: `${textColor}35`, color: textColor }"
                @click="addItem(sectionIndex)"
              >
                <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar ítem
              </button>
            </div>

            <div
              v-for="(item, itemIndex) in section.items || []"
              :key="item.id"
              class="group/item relative space-y-3 rounded-lg border p-3"
              :style="{ borderColor: `${textColor}18` }"
            >
              <button
                type="button"
                class="absolute right-2 top-2 rounded border border-red-500/40 bg-white/90 px-2 py-0.5 text-[11px] text-red-600 opacity-100 transition-opacity dark:bg-slate-900/90 dark:text-red-400 md:opacity-0 md:group-hover/item:opacity-100 md:group-focus-within/item:opacity-100"
                @click="deleteItem(sectionIndex, itemIndex)"
              >
                Eliminar
              </button>
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 flex-1 space-y-2">
                  <input
                    v-model="item.name"
                    type="text"
                    placeholder="Nombre del ítem"
                    class="w-full rounded-lg border px-2 py-1.5 text-sm font-medium outline-none"
                    :style="{
                      borderColor: `${textColor}30`,
                      backgroundColor: backgroundColor,
                      color: textColor,
                    }"
                  />
                  <textarea
                    v-model="item.description"
                    rows="2"
                    placeholder="Descripción (opcional)"
                    class="w-full resize-y rounded-lg border px-2 py-1.5 text-xs outline-none"
                    :style="{
                      borderColor: `${textColor}30`,
                      backgroundColor: backgroundColor,
                      color: textColor,
                    }"
                  />
                </div>
                <div class="flex h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-slate-100 dark:bg-slate-800" :style="{ borderColor: `${textColor}20` }">
                  <img
                    :src="getMenuItemImageSrc(item, section.name)"
                    :alt="item.name || 'ítem'"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label class="group/label mb-0.5 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-wide opacity-60" :for="`price-${item.id}`">
                    <span>Precio</span>
                    <svg class="h-2.5 w-2.5 opacity-0 transition-opacity group-hover/label:opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </label>
                  <input
                    :id="`price-${item.id}`"
                    v-model.number="item.price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    class="w-full rounded border px-2 py-1.5 text-sm outline-none"
                    :style="{
                      borderColor: `${textColor}30`,
                      backgroundColor: backgroundColor,
                      color: textColor,
                    }"
                  />
                </div>
                <div>
                  <label class="group/label mb-0.5 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-wide opacity-60" :for="`img-${item.id}`">
                    <span>URL imagen</span>
                    <svg class="h-2.5 w-2.5 opacity-0 transition-opacity group-hover/label:opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </label>
                  <input
                    :id="`img-${item.id}`"
                    v-model="item.imageUrl"
                    type="url"
                    placeholder="https://…"
                    class="w-full rounded border px-2 py-1.5 text-sm outline-none"
                    :style="{
                      borderColor: `${textColor}30`,
                      backgroundColor: backgroundColor,
                      color: textColor,
                    }"
                  />
                </div>
              </div>
              <div>
                <label class="group/label mb-0.5 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-wide opacity-60" :for="`tags-${item.id}`">
                  <span>Tags (separados por comas)</span>
                  <svg class="h-2.5 w-2.5 opacity-0 transition-opacity group-hover/label:opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </label>
                <input
                  :id="`tags-${item.id}`"
                  v-model="item.tagsString"
                  type="text"
                  class="w-full rounded border px-2 py-1.5 text-sm outline-none"
                  :style="{
                    borderColor: `${textColor}30`,
                    backgroundColor: backgroundColor,
                    color: textColor,
                  }"
                  placeholder="Vegano, Popular…"
                  @blur="updateItemTags(sectionIndex, itemIndex)"
                />
              </div>
              <div class="flex items-center justify-between">
                <label class="group/label inline-flex items-center gap-2 text-sm">
                  <input v-model="item.isAvailable" type="checkbox" class="rounded" />
                  <span>Disponible</span>
                  <svg class="h-3 w-3 opacity-0 transition-opacity group-hover/label:opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </label>
                <span class="text-[11px] opacity-50">hover para acciones</span>
              </div>
            </div>

            <p v-if="!section.items || section.items.length === 0" class="py-2 text-center text-xs opacity-50">
              No hay ítems. Usá «Agregar ítem».
            </p>
          </div>
        </section>

        <div v-if="!editorSections.length" class="rounded-lg border border-dashed py-8 text-center text-sm opacity-70" :style="{ borderColor: `${textColor}35` }">
          <p class="mb-3">Aún no hay secciones</p>
          <button
            type="button"
            @click="addSection"
            class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
            :style="{
              borderColor: priceColor,
              color: priceColor,
              backgroundColor: `${priceColor}10`,
            }"
          >
            Crear primera sección
          </button>
        </div>
      </main>

      <main v-else class="flex-1 space-y-12 pb-12" role="main" id="panel-secciones-menu">
        <div v-if="editable && isPreview" class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium opacity-90">Secciones e ítems</p>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            :style="{
              borderColor: priceColor,
              color: priceColor,
              backgroundColor: `${priceColor}10`,
            }"
            @click="addSection"
          >
            <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva sección
          </button>
        </div>

        <div
          v-if="editable && isPreview && filteredSections.length === 0"
          class="rounded-lg border border-dashed py-8 text-center text-sm opacity-75"
          :style="{ borderColor: `${textColor}35` }"
        >
          <p class="mb-3">Aún no hay secciones</p>
          <button
            type="button"
            @click="addSection"
            class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
            :style="{
              borderColor: priceColor,
              color: priceColor,
              backgroundColor: `${priceColor}10`,
            }"
          >
            Crear primera sección
          </button>
        </div>

        <section
          v-for="section in filteredSections"
          :key="section.id"
          class="space-y-6"
        >
          <div class="space-y-3">
            <div
              role="button"
              tabindex="0"
              class="w-full flex items-center gap-4 group"
              :aria-label="`${isSectionCollapsed(section.id) ? 'Expandir' : 'Colapsar'} sección ${section.name}`"
              :aria-expanded="!isSectionCollapsed(section.id)"
              @click="selectSection(section.id); toggleSection(section.id)"
              @keydown.enter.prevent="selectSection(section.id); toggleSection(section.id)"
              @keydown.space.prevent="selectSection(section.id); toggleSection(section.id)"
            >
              <h2
                class="text-2xl sm:text-3xl md:text-4xl tracking-tight text-left flex-shrink-0"
                :class="headingWeightClass"
              >
                <span v-if="!(editable && isEditing('section', section.id, 'name'))" class="group inline-flex items-center gap-1">
                  {{ section.name }}
                  <button
                    v-if="editable"
                    type="button"
                    class="opacity-0 transition-opacity group-hover:opacity-60"
                    title="Editar"
                    @click.stop="startEditing('section', section.id, 'name')"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <span
                    v-if="editable && isPreview && selectedSectionId === section.id"
                    class="inline-flex items-center justify-center opacity-85 transition-opacity hover:opacity-100"
                    :style="deleteIconStyle"
                    title="Eliminar sección"
                    aria-label="Eliminar sección"
                    role="button"
                    @click.stop="openDeleteSectionConfirm(section)"
                  >
                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                    </svg>
                  </span>
                </span>
                <input
                  v-else
                  v-model="section.name"
                  class="w-full rounded border border-slate-300 bg-white/90 px-2 py-1 text-base text-slate-900"
                  @click.stop
                  @blur="stopEditing"
                  @keydown.enter.prevent="stopEditing"
                />
              </h2>
              <div class="flex-1 h-px opacity-30" :style="{ backgroundColor: textColor }" />
              <div class="flex-shrink-0 transition-transform duration-200" :class="{ 'rotate-90': isSectionCollapsed(section.id) }">
                <svg
                  class="h-6 w-6 opacity-60 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="section.description && !(editable && isEditing('section', section.id, 'description'))" class="group text-sm sm:text-base opacity-80 leading-relaxed italic max-w-2xl">
              <span class="inline-flex items-center gap-1">
                {{ section.description }}
                <button
                  v-if="editable"
                  type="button"
                  class="opacity-0 transition-opacity group-hover:opacity-60"
                  title="Editar"
                  @click.stop="startEditing('section', section.id, 'description')"
                >
                  <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </span>
            </p>
            <textarea
              v-else-if="editable && isEditing('section', section.id, 'description')"
              v-model="section.description"
              rows="2"
              class="w-full max-w-2xl resize-none rounded border border-slate-300 bg-white/90 px-2 py-1 text-sm text-slate-900"
              @blur="stopEditing"
            />
            <div v-if="editable && isPreview" class="flex items-center justify-end">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                :style="{
                  borderColor: priceColor,
                  color: priceColor,
                  backgroundColor: `${priceColor}10`,
                }"
                @click.stop="addItemToSection(section.id)"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar ítem
              </button>
            </div>
          </div>

          <div
            v-show="!isSectionCollapsed(section.id)"
            class="space-y-6 transition-all duration-300"
          >
            <article
              v-for="item in section.items"
              :key="item.id"
              class="group relative"
            >
              <div class="flex items-start justify-between gap-4 sm:gap-6">
                <div class="flex-shrink-0">
                  <img
                    :src="getMenuItemImageSrc(item, section.name)"
                    :alt="`${item.name}${item.description ? ' - ' + item.description : ''}`"
                    loading="lazy"
                    class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 shadow-md bg-slate-100"
                  />
                </div>

                <div class="flex-1 space-y-3 min-w-0">
                  <div class="space-y-2">
                    <h3
                      class="text-xl sm:text-2xl leading-tight tracking-tight"
                      :class="headingWeightClass"
                    >
                      <span v-if="!(editable && isEditing('item', item.id, 'name'))" class="group inline-flex items-center gap-1">
                        {{ item.name }}
                        <button
                          v-if="editable"
                          type="button"
                          class="opacity-0 transition-opacity group-hover:opacity-60"
                          title="Editar"
                          @click.stop="startEditing('item', item.id, 'name')"
                        >
                          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </span>
                      <input
                        v-else
                        v-model="item.name"
                        class="w-full rounded border border-slate-300 bg-white/90 px-2 py-1 text-sm text-slate-900"
                        @blur="stopEditing"
                        @keydown.enter.prevent="stopEditing"
                      />
                    </h3>
                    <p v-if="item.description && !(editable && isEditing('item', item.id, 'description'))" class="group text-sm sm:text-base leading-relaxed opacity-80 max-w-2xl">
                      <span class="inline-flex items-center gap-1">
                        {{ item.description }}
                        <button
                          v-if="editable"
                          type="button"
                          class="opacity-0 transition-opacity group-hover:opacity-60"
                          title="Editar"
                          @click.stop="startEditing('item', item.id, 'description')"
                        >
                          <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </span>
                    </p>
                    <textarea
                      v-else-if="editable && isEditing('item', item.id, 'description')"
                      v-model="item.description"
                      rows="2"
                      class="w-full max-w-2xl resize-none rounded border border-slate-300 bg-white/90 px-2 py-1 text-sm text-slate-900"
                      @blur="stopEditing"
                    />
                  </div>
                  <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2 pt-1">
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium opacity-80 border"
                      :style="{
                        backgroundColor: `${textColor}12`,
                        color: textColor,
                        borderColor: `${textColor}25`,
                      }"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <div class="flex flex-col items-end gap-2 flex-shrink-0 pt-1">
                  <button
                    v-if="editable && isPreview"
                    type="button"
                    class="p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                    :style="deleteIconStyle"
                    title="Eliminar ítem"
                    @click.stop="openDeleteItemConfirm(section, item)"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                    </svg>
                  </button>
                  <span
                    v-if="item.price != null && shouldShowPrices && !(editable && isEditing('item', item.id, 'price'))"
                    class="text-2xl sm:text-3xl font-bold tabular-nums whitespace-nowrap"
                    :style="{ color: priceColor }"
                    @click.stop="editable && startEditing('item', item.id, 'price')"
                  >
                    ${{ item.price.toLocaleString('es-AR') }}
                  </span>
                  <input
                    v-else-if="shouldShowPrices && editable && isEditing('item', item.id, 'price')"
                    v-model.number="item.price"
                    type="number"
                    min="0"
                    step="1"
                    class="w-24 rounded border border-slate-300 bg-white/90 px-2 py-1 text-right text-sm font-semibold text-slate-900"
                    @blur="stopEditing"
                    @keydown.enter.prevent="stopEditing"
                  />
                  <span
                    v-if="item.isAvailable === false"
                    class="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 border border-amber-200"
                  >
                    agotado
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <div
        v-if="showDeleteSectionConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4"
        @click.self="closeDeleteSectionConfirm"
      >
        <div class="w-full max-w-md rounded-xl border bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">
            {{ deleteTargetType === 'section' ? '¿Eliminar sección?' : '¿Eliminar ítem?' }}
          </h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Se eliminará
            <span class="font-medium">"{{ sectionToDelete?.name || 'Elemento' }}"</span>
            {{ deleteTargetType === 'section' ? ' y sus ítems.' : '.' }}
          </p>
          <div class="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              class="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="closeDeleteSectionConfirm"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              @click="confirmDeleteSection"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>

      <footer class="mt-auto border-t pt-8" :style="{ borderColor: `${textColor}20` }" role="contentinfo">
        <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs opacity-60">
          <span class="italic">Menú</span>
          <span>·</span>
          <span>
            Hecho con
            <NuxtLink
              to="/"
              class="font-semibold underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded"
              :style="{ color: priceColor }"
            >
              MapaMorfi
            </NuxtLink>
          </span>
          <span aria-hidden="true">·</span>
          <NuxtLink
            to="/privacidad"
            class="underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded"
            :style="{ color: priceColor }"
          >
            Privacidad
          </NuxtLink>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRef, watch } from 'vue'
import { normalizeBusinessSections, filterSectionsWithItems } from '~/composables/useMenuNormalizer'
import { getContrastTextColor } from '~/composables/useColorUtils'
import { getMenuItemImageSrc } from '~/composables/useMenuItemPlaceholder'

const props = defineProps({
  business: {
    type: Object,
    required: true,
  },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#1f2937' },
  priceColor: { type: String, default: '#059669' },
  fontFamily: { type: String, default: 'Inter, system-ui, sans-serif' },
  headingWeightClass: { type: String, default: 'font-bold' },
  shouldShowPrices: { type: Boolean, default: true },
  activeDeliveryPlatforms: { type: Array, default: () => [] },
  isOpenNow: { type: Boolean, default: true },
  hasSocialMedia: { type: Boolean, default: false },
  isAuthenticated: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isLoadingFavorite: { type: Boolean, default: false },
  isPreview: { type: Boolean, default: false },
  /**
   * Editor inline en el panel: edita secciones/ítems sobre el mismo `business` (vista diseño vertical).
   */
  editable: { type: Boolean, default: false },
})

defineEmits(['toggle-favorite', 'share-whatsapp', 'share-facebook', 'copy-link', 'export-pdf'])

const businessRef = toRef(props, 'business')
const { addSection, deleteSection, addItem, deleteItem, updateItemTags, moveSection } = useMenuSectionEditor(businessRef)

const editorSections = computed(() => {
  if (!props.editable || !props.isPreview) return []
  const s = props.business?.sections
  return Array.isArray(s) ? s : []
})

const selectedSectionId = ref('')

const layoutLabelPublic = computed(() => {
  const m = props.business?.menuLayout || 'vertical'
  if (m === 'tabs') return 'Tabs / lista'
  if (m === 'grid') return 'Grid / visual'
  if (m === 'categories') return 'Categorías / cards'
  if (m === 'two-columns') return 'Dos columnas'
  return 'Vertical / clásico'
})

watch(
  () => props.business?.sections,
  (sections) => {
    if (!props.editable || !sections) return
    if (!selectedSectionId.value && sections.length > 0) {
      selectedSectionId.value = sections[0]?.id || ''
    }
    for (const s of sections) {
      for (const it of s.items || []) {
        if (it.tagsString === undefined && Array.isArray(it.tags) && it.tags.length) {
          it.tagsString = it.tags.join(', ')
        }
      }
    }
  },
  { deep: true, immediate: true }
)

const searchQuery = ref('')
const showShareMenu = ref(false)
const showHoursModal = ref(false)
const collapsedSections = ref(new Set())
const editingKey = ref('')
const showDeleteSectionConfirm = ref(false)
const deleteTargetType = ref('section')
const sectionToDelete = ref(null)
const sectionToDeleteId = ref('')
const deleteTargetItemId = ref('')
const deleteIconStyle = computed(() => ({
  color: getContrastTextColor(props.backgroundColor || '#ffffff') === '#ffffff' ? '#fecaca' : '#b91c1c',
  filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.75)) drop-shadow(0 1px 1px rgba(15,23,42,0.65))',
}))

const keyFor = (entity, id, field) => `${entity}:${id}:${field}`
const isEditing = (entity, id, field) => editingKey.value === keyFor(entity, id, field)
const startEditing = (entity, id, field) => {
  if (!props.editable) return
  editingKey.value = keyFor(entity, id, field)
}
const stopEditing = () => {
  editingKey.value = ''
}
const selectSection = (sectionId) => {
  selectedSectionId.value = sectionId || ''
}
const addItemToSection = (sectionId) => {
  const sections = Array.isArray(props.business?.sections) ? props.business.sections : []
  const sectionIndex = sections.findIndex((s) => s?.id === sectionId)
  if (sectionIndex >= 0) addItem(sectionIndex)
}

const openDeleteSectionConfirm = (section) => {
  if (!props.editable || !props.isPreview) return
  if (showDeleteSectionConfirm.value) return
  deleteTargetType.value = 'section'
  sectionToDelete.value = section || null
  sectionToDeleteId.value = section?.id || ''
  deleteTargetItemId.value = ''
  showDeleteSectionConfirm.value = true
}

const openDeleteItemConfirm = (section, item) => {
  if (!props.editable || !props.isPreview) return
  if (showDeleteSectionConfirm.value) return
  deleteTargetType.value = 'item'
  sectionToDelete.value = item || null
  sectionToDeleteId.value = section?.id || ''
  deleteTargetItemId.value = item?.id || ''
  showDeleteSectionConfirm.value = true
}

const closeDeleteSectionConfirm = () => {
  showDeleteSectionConfirm.value = false
  sectionToDelete.value = null
  sectionToDeleteId.value = ''
  deleteTargetItemId.value = ''
}

const confirmDeleteSection = () => {
  const sections = Array.isArray(props.business?.sections) ? props.business.sections : []
  const sectionIndex = sections.findIndex((s) => s?.id === sectionToDeleteId.value)
  if (sectionIndex < 0) return closeDeleteSectionConfirm()
  if (deleteTargetType.value === 'section') {
    deleteSection(sectionIndex)
  } else {
    const items = Array.isArray(sections[sectionIndex]?.items) ? sections[sectionIndex].items : []
    const itemIndex = items.findIndex((it) => it?.id === deleteTargetItemId.value)
    if (itemIndex >= 0) deleteItem(sectionIndex, itemIndex)
  }
  closeDeleteSectionConfirm()
}

const toggleSection = (sectionId) => {
  if (collapsedSections.value.has(sectionId)) {
    collapsedSections.value.delete(sectionId)
  } else {
    collapsedSections.value.add(sectionId)
  }
}

const isSectionCollapsed = (sectionId) => collapsedSections.value.has(sectionId)

const filteredSections = computed(() => {
  if (props.editable && props.isPreview) {
    const source = Array.isArray(props.business?.sections) ? props.business.sections : []
    return source.filter((section) => Array.isArray(section?.items))
  }
  let sections = filterSectionsWithItems(normalizeBusinessSections(props.business))
  if (sections.length === 0) return []
  if (!searchQuery.value.trim()) return sections
  const query = searchQuery.value.toLowerCase().trim()
  return sections
    .map((section) => {
      const filteredItems = (section.items || []).filter((item) => {
        if (!item || !item.name) return false
        const nameMatch = item.name?.toLowerCase().includes(query)
        const descMatch = item.description?.toLowerCase().includes(query)
        const tagMatch = Array.isArray(item.tags) && item.tags.some((tag) => tag?.toLowerCase().includes(query))
        return nameMatch || descMatch || tagMatch
      })
      return { ...section, items: filteredItems }
    })
    .filter((section) => section.items && section.items.length > 0)
})
</script>
