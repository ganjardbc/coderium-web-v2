<template>
  <div>
    <header class="border-b">
      <nav class="max-w-6xl mx-auto px-4 py-4">
        <NuxtLink to="/" class="text-xl font-bold">Coderium</NuxtLink>
      </nav>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="border-t mt-16">
      <div class="max-w-6xl mx-auto px-4 py-8 text-center text-gray-500">
        &copy; {{ new Date().getFullYear() }} Coderium
      </div>
    </footer>
  </div>
</template>
