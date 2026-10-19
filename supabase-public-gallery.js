// Configuración pública de Supabase. La anon key está diseñada para usarse en el navegador;
// la seguridad real la proporcionan las políticas RLS del proyecto.
const SUPABASE_URL = 'https://welchmcywrbolrndyzpf.supabase.co';
const SUPABASE_ANON_KEY = 'PEGA_AQUI_TU_ANON_KEY';

(async () => {
  const root = document.getElementById('live-media');
  if (!root || SUPABASE_ANON_KEY.includes('PEGA_AQUI')) return;
  const { createClient } = window.supabase;
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await client.from('media').select('*').eq('is_published', true).order('created_at', { ascending: false });
  if (error) { root.innerHTML = '<p>No se pudieron cargar los recuerdos en este momento.</p>'; return; }
  if (!data?.length) { root.innerHTML = '<p>Aquí aparecerán nuestros recuerdos publicados.</p>'; return; }
  root.innerHTML = '';
  for (const item of data) {
    const url = client.storage.from('media').getPublicUrl(item.storage_path).data.publicUrl;
    const card = document.createElement('article');
    card.className = 'live-memory-card';
    const media = item.media_type === 'video' ? document.createElement('video') : document.createElement('img');
    media.src = url;
    media.loading = 'lazy';
    if (media.tagName === 'VIDEO') { media.controls = true; media.preload = 'metadata'; }
    media.alt = item.title || 'Recuerdo';
    const title = document.createElement('h3'); title.textContent = item.title || 'Recuerdo';
    const description = document.createElement('p'); description.textContent = item.description || '';
    card.append(media, title, description); root.append(card);
  }
})();
