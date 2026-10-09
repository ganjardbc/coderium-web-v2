<template>
  <div class="page-shell">
    <PageHeader title="Kebijakan Privasi">Terakhir diperbarui: {{ lastUpdated }}</PageHeader>

    <div class="max-w-3xl space-y-8 md:space-y-10 body-copy">
      <section>
        <h2 class="section-title mb-3">1. Informasi yang kami kumpulkan</h2>
        <p>
          Kami mengumpulkan informasi seminimal mungkin yang diperlukan untuk menjalankan Coderium, seperti halaman yang dikunjungi,
          kata kunci pencarian di situs, dan data teknis dasar (browser, jenis perangkat) lewat analitik standar.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">2. Cara kami menggunakannya</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>Untuk menjalankan dan memperbaiki situs, artikel, dan daftar produk.</li>
          <li>Untuk memahami konten mana yang berguna bagi pembaca.</li>
          <li>Untuk membalas pesan yang dikirim langsung kepada kami (misalnya lewat email).</li>
        </ul>
      </section>

      <section>
        <h2 class="section-title mb-3">3. Cookie &amp; penyimpanan lokal</h2>
        <p>
          Situs dapat memakai cookie atau penyimpanan lokal browser untuk keperluan fungsional, seperti mengingat
          pilihan mode gelap/terang Anda. Data ini tidak mengidentifikasi Anda secara pribadi.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">4. Pihak ketiga</h2>
        <p>
          Kami tidak menjual informasi pribadi Anda. Kami dapat memakai layanan pihak ketiga (seperti penyedia hosting atau analitik)
          yang memproses data teknis atas nama kami, sesuai kebijakan privasi mereka sendiri.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">5. Pilihan Anda</h2>
        <p>
          Anda dapat mengatur cookie lewat pengaturan browser. Anda juga dapat menghubungi kami untuk menanyakan data apa yang kami simpan
          tentang Anda atau meminta data itu dihapus.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">6. Perubahan kebijakan</h2>
        <p>
          Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan penting ditandai dengan memperbarui tanggal
          di atas.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">7. Kontak</h2>
        <p>
          Pertanyaan tentang kebijakan ini dapat dikirim ke
          <a href="mailto:coderium.id@gmail.com" class="text-gray-900 dark:text-white underline hover:no-underline">coderium.id@gmail.com</a>.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

useSeo({
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi Coderium.',
});

const lastUpdated = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
</script>
