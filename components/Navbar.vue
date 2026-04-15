<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 md:relative md:bottom-auto md:border-b md:border-slate-200/80 dark:md:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 md:backdrop-blur-md md:supports-[backdrop-filter]:bg-white/80 md:dark:supports-[backdrop-filter]:bg-slate-950/80">
    <!-- Mobile: Bottom Navigation Bar -->
    <div class="md:hidden border-t border-slate-200 dark:border-slate-800">
      <div class="flex items-center justify-around h-16 px-2">
        <NuxtLink
          to="/"
          class="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
          :class="isActive('/') && !isActive('/discover') && !isActive('/favorites') && !isActive('/select-business') && !isActive('/profile') && !isActive('/crm') && !isActive('/contact') ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs font-medium">Inicio</span>
        </NuxtLink>
        
        <NuxtLink
          to="/discover"
          class="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
          :class="isActive('/discover') ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-xs font-medium">Mapa</span>
        </NuxtLink>
        
        <!-- Opciones para usuarios autenticados -->
        <template v-if="isAuthenticated">
          <NuxtLink
            to="/select-business"
            class="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
            :class="isActive('/select-business') || isActive('/create-business') ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="text-xs font-medium">Comercios</span>
          </NuxtLink>
        </template>
        
        <!-- Opciones para usuarios no autenticados -->
        <template v-else>
          <NuxtLink
            to="/login"
            class="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
            :class="isActive('/login') ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span class="text-xs font-medium">Entrar</span>
          </NuxtLink>
          
          <NuxtLink
            to="/register"
            class="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors"
            :class="isActive('/register') ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span class="text-xs font-medium">Registro</span>
          </NuxtLink>
        </template>
        
        <!-- Menú lateral (hamburger) -->
        <div class="flex-1">
          <button
            type="button"
            @click.stop="showProfileMenu = !showProfileMenu"
            class="flex flex-col items-center justify-center gap-1 w-full py-2 transition-colors"
            :class="showProfileMenu ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span class="text-xs font-medium">Menú</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar lateral -->
    <div
      v-if="showProfileMenu"
      class="fixed inset-0 z-[9999] md:hidden"
      data-mobile-sidebar-root
      @click.self="showProfileMenu = false"
    >
      <!-- Overlay oscuro -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showProfileMenu = false"></div>
      
      <!-- Sidebar: deslizar hacia la derecha para cerrar (mobile) -->
      <div
        class="mobile-nav-sidebar-panel absolute right-0 top-0 bottom-0 z-[10000] w-80 overflow-y-auto border-l border-slate-200 bg-white shadow-xl touch-pan-y transition-transform duration-200 ease-out will-change-transform dark:border-slate-800 dark:bg-slate-900"
        :class="sidebarSwipeDragging ? 'duration-0' : ''"
        :style="sidebarTranslateStyle"
        @touchstart.passive="onSidebarSwipeStart"
        @touchmove="onSidebarSwipeMove"
        @touchend="onSidebarSwipeEnd"
        @touchcancel="onSidebarSwipeEnd"
      >
        <div class="p-6">
          <!-- Header del sidebar -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50">Menú</h2>
            <button
              type="button"
              @click="showProfileMenu = false"
              class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Contenido del sidebar -->
          <div class="space-y-1">
            <template v-if="isAuthenticated">
              <!-- Información del plan actual -->
              <div class="px-4 py-3 mb-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p class="text-xs text-slate-600 dark:text-slate-400 mb-1">Plan actual</p>
                <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {{ userPlan.name }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                  ${{ userPlan.price }}/mes
                </p>
              </div>
              
              <NuxtLink
                to="/favorites"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/favorites') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span class="font-medium">Favoritos</span>
              </NuxtLink>
              
              <NuxtLink
                to="/profile"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/profile') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="font-medium">Perfil</span>
              </NuxtLink>
              <NuxtLink
                to="/billing"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/billing') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span class="font-medium">Planes</span>
              </NuxtLink>
              <NuxtLink
                to="/contact"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/contact') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span class="font-medium">Contacto</span>
              </NuxtLink>
              <NuxtLink
                v-if="userRole === 'admin' || userEmail === 'gonzalezoctavio5@gmail.com'"
                to="/crm"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/crm') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="font-medium">CRM</span>
              </NuxtLink>
              <div class="border-t border-slate-200 dark:border-slate-800 my-4"></div>
              <div class="flex items-center justify-between px-4 py-3 rounded-lg">
                <div class="flex items-center gap-3">
                  <svg class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span class="text-base font-medium text-slate-700 dark:text-slate-300">Tema</span>
                </div>
                <ThemeToggle />
              </div>
              <div class="border-t border-slate-200 dark:border-slate-800 my-4"></div>
              <button
                type="button"
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="font-medium">Cerrar sesión</span>
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/contact"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/contact') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span class="font-medium">Contacto</span>
              </NuxtLink>
              <NuxtLink
                to="/login"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/login') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span class="font-medium">Iniciar sesión</span>
              </NuxtLink>
              <NuxtLink
                to="/register"
                @click="showProfileMenu = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-base text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                :class="isActive('/register') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span class="font-medium">Crear cuenta</span>
              </NuxtLink>
              <div class="border-t border-slate-200 dark:border-slate-800 my-4"></div>
              <div class="flex items-center justify-between px-4 py-3 rounded-lg">
                <div class="flex items-center gap-3">
                  <svg class="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span class="text-base font-medium text-slate-700 dark:text-slate-300">Tema</span>
                </div>
                <ThemeToggle />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop: Top Navigation Bar -->
    <div class="hidden md:block">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <NuxtLink
            :to="isAuthenticated ? '/select-business' : '/'"
            class="flex items-center gap-2"
          >
            <div class="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span class="text-white font-bold text-sm">QR</span>
            </div>
            <span class="font-semibold text-slate-900 dark:text-slate-50">
              MapaMorfi
            </span>
          </NuxtLink>

          <!-- Navigation Links (simplificado - solo elementos esenciales) -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1">
              <NuxtLink
                to="/"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  isActive('/') && !isActive('/discover') && !isActive('/favorites') && !isActive('/select-business') && !isActive('/profile') && !isActive('/crm')
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900'
                ]"
              >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </NuxtLink>
            
            <NuxtLink
              to="/discover"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                isActive('/discover')
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900'
              ]"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Mapa
            </NuxtLink>
            
            <template v-if="isAuthenticated">
              <NuxtLink
                to="/select-business"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  isActive('/select-business') || isActive('/create-business')
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900'
                ]"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Mis comercios
              </NuxtLink>
            </template>
            </div>
          </div>

          <!-- Right side actions -->
          <div class="flex items-center gap-3">
            <ThemeToggle />
            <template v-if="isAuthenticated">
              <NuxtLink
                to="/profile"
                :class="[
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                  isActive('/profile') || isActive('/billing')
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900'
                ]"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Perfil
              </NuxtLink>
              <button
                type="button"
                @click="handleLogout"
                class="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Salir
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/login"
                class="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Entrar
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                Registrarse
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const { getDefaultPlan, getPlanById } = usePlans()

const isAuthenticated = ref(false)
const userEmail = ref('')
const userRole = ref(null)
const userPlan = ref(getDefaultPlan())
const showProfileMenu = ref(false)

/** Cierre del sidebar en mobile deslizando hacia la derecha (panel anclado a la derecha) */
const sidebarTranslatePx = ref(0)
const sidebarSwipeDragging = ref(false)
let sidebarTouchStartX = 0
let sidebarTouchStartY = 0
/** null hasta decidir; 'h' = gesto horizontal (cerrar); 'v' = scroll vertical */
let sidebarSwipeAxis = /** @type {null | 'h' | 'v'} */ (null)

const sidebarTranslateStyle = computed(() => {
  const x = sidebarTranslatePx.value
  if (x <= 0) return {}
  return { transform: `translateX(${x}px)` }
})

function onSidebarSwipeStart(e) {
  if (!process.client || window.innerWidth >= 768) return
  sidebarTouchStartX = e.touches[0].clientX
  sidebarTouchStartY = e.touches[0].clientY
  sidebarSwipeAxis = null
}

function onSidebarSwipeMove(e) {
  if (!process.client || window.innerWidth >= 768) return
  const x = e.touches[0].clientX
  const y = e.touches[0].clientY
  const dx = x - sidebarTouchStartX
  const dy = y - sidebarTouchStartY

  if (sidebarSwipeAxis === null) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return
    sidebarSwipeAxis = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v'
  }
  if (sidebarSwipeAxis !== 'h') return
  // Solo hacia la derecha (cerrar)
  if (dx <= 0) {
    sidebarTranslatePx.value = 0
    return
  }
  e.preventDefault()
  sidebarSwipeDragging.value = true
  const max = Math.min(window.innerWidth, 360)
  sidebarTranslatePx.value = Math.min(dx, max)
}

function onSidebarSwipeEnd() {
  if (!process.client || window.innerWidth >= 768) return
  const dx = sidebarTranslatePx.value
  sidebarSwipeDragging.value = false
  sidebarSwipeAxis = null
  if (dx >= 56) {
    showProfileMenu.value = false
  }
  sidebarTranslatePx.value = 0
}

watch(showProfileMenu, (open) => {
  if (!open) {
    sidebarTranslatePx.value = 0
    sidebarSwipeDragging.value = false
    sidebarSwipeAxis = null
  }
})

const isActive = (path) => {
  return route.path?.startsWith(path)
}

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem('qrmenu-auth')
    router.push('/login')
  }
}

function handleClickOutside(e) {
  if (!showProfileMenu.value || window.innerWidth >= 768) return
  if (e.target.closest('[data-mobile-sidebar-root]')) return
  showProfileMenu.value = false
}

const loadUserPlan = async () => {
  try {
    let userId = null
    if (process.client) {
      const auth = localStorage.getItem('qrmenu-auth')
      if (auth) {
        try {
          const parsed = JSON.parse(auth)
          userId = parsed.userId
        } catch {
          // Error parsing
        }
      }
    }

    if (userId) {
      const response = await $fetch(`/api/users/profile?userId=${userId}`)
      if (response && response.user && response.user.plan) {
        userPlan.value = getPlanById(response.user.plan) || getDefaultPlan()
      }
    }
  } catch (err) {
    console.error('Error loading user plan:', err)
  }
}

onMounted(async () => {
  if (process.client) {
    const auth = localStorage.getItem('qrmenu-auth')
    if (auth) {
      try {
        const parsed = JSON.parse(auth)
        if (parsed.loggedIn === true) {
          isAuthenticated.value = true
          userEmail.value = parsed.email || ''
          userRole.value = parsed.role || null
          await loadUserPlan()
        }
      } catch {
        isAuthenticated.value = false
      }
    }

    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>
