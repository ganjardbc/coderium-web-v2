<template>
  <div class="page-shell">
    <PageHeader title="Ketentuan Layanan">Terakhir diperbarui: {{ lastUpdated }}</PageHeader>

    <div class="max-w-3xl space-y-8 md:space-y-10 body-copy">
      <section>
        <h2 class="section-title mb-3">1. Persetujuan atas ketentuan</h2>
        <p>
          Dengan mengakses atau menggunakan Coderium ("kami", "situs"), Anda setuju untuk terikat pada Ketentuan Layanan ini.
          Jika Anda tidak setuju, mohon tidak menggunakan situs ini.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">2. Konten</h2>
        <p>
          Artikel, series, dan konten lain yang terbit di Coderium disediakan hanya untuk tujuan informasi dan edukasi.
          Konten dapat diperbarui atau dihapus kapan saja tanpa pemberitahuan, dan kami tidak menjamin
          ketepatan maupun kelengkapannya.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">3. Kekayaan intelektual</h2>
        <p>
          Kecuali dinyatakan lain, seluruh konten, logo, dan merek di Coderium adalah milik Coderium.
          Anda boleh membagikan tautan ke konten kami, tetapi memperbanyak atau menyebarkan ulang tanpa izin tidak diperbolehkan.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">4. Produk</h2>
        <p>
          Produk atau tool yang tercantum di situs disediakan "sebagaimana adanya". Ketersediaan, harga, dan fitur dapat
          berubah tanpa pemberitahuan sebelumnya.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">5. Batasan tanggung jawab</h2>
        <p>
          Coderium tidak bertanggung jawab atas kerugian yang timbul dari penggunaan, atau ketidakmampuan menggunakan, situs maupun
          kontennya.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">6. Perubahan ketentuan</h2>
        <p>
          Kami dapat memperbarui ketentuan ini dari waktu ke waktu. Terus menggunakan situs setelah perubahan diterbitkan berarti
          Anda menerima ketentuan yang telah direvisi.
        </p>
      </section>

      <section>
        <h2 class="section-title mb-3">7. Kontak</h2>
        <p>
          Pertanyaan tentang ketentuan ini dapat dikirim ke
          <a href="mailto:hello@coderium.id" class="text-gray-900 dark:text-white underline hover:no-underline">hello@coderium.id</a>.
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
  title: 'Ketentuan Layanan',
  description: 'Ketentuan layanan Coderium.',
});

const lastUpdated = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
</script>
