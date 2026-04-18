<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
    <main class="mx-auto max-w-2xl px-5 py-12 sm:px-6">
      <h1 class="text-2xl font-semibold tracking-tight">Privacidad y datos</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Información sobre el uso de datos en MapaMorfi cuando visitás un menú digital o usás la plataforma.
      </p>

      <section class="mt-8 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">
          Menús públicos y analíticas
        </h2>
        <p>
          Al abrir un menú mediante enlace o código QR, el comercio puede recibir estadísticas agregadas
          (por ejemplo, visualizaciones del menú) enviadas a los servidores de MapaMorfi. Esos eventos se
          asocian al comercio y no están pensados para identificarte personalmente como comensal.
        </p>

        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
          Cuenta e inicio de sesión
        </h2>
        <p>
          Si creás una cuenta, tratamos los datos necesarios para autenticación, facturación cuando
          corresponda y soporte, según lo que indiques al registrarte o contratar un plan.
        </p>

        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
          Tus derechos
        </h2>
        <p>
          Podés solicitar acceso, rectificación o eliminación de tus datos personales según la ley
          aplicable en tu país, contactando al responsable del servicio que figura en el sitio principal.
        </p>
      </section>

      <p class="mt-10">
        <NuxtLink
          to="/"
          class="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Volver al inicio
        </NuxtLink>
      </p>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'Privacidad · MapaMorfi',
  meta: [
    {
      name: 'description',
      content:
        'Información sobre privacidad, analíticas de menús y datos de cuenta en MapaMorfi.',
    },
  ],
})
</script>
