<script>
  import links from './../content/footer/links.md';
  import SvelteMarkdown from 'svelte-markdown';
  import FooterLink from './Footer/FooterLink.svelte';
  import FooterListItem from './Footer/FooterListItem.svelte';
  import Footer from './shared/Layout/Footer.svelte';

  const renderers = {
    link: FooterLink,
    listitem: FooterListItem
  };
</script>

<Footer>
  <p slot="description" class="fr-footer__content-desc">
    Territoires en transitions accompagne les collectivités afin de les aider à piloter plus
    facilement leur transition écologique.
  </p>

  <div slot="navigation" class="fr-footer__bottom">
    <ul class="fr-footer__bottom-list">
      <SvelteMarkdown source={links.content} {renderers} />
    </ul>
  </div>
</Footer>
