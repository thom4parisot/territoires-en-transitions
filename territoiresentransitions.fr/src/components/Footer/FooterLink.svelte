<script>
  export let href = '';
  export let title = undefined;
</script>

<a
  class="fr-footer__bottom-link"
  {href}
  {title}
  rel={href.substring(0, 4) === 'http' ? 'external' : undefined}
  target={href.substring(0, 4) === 'http' ? '_blank' : '_self'}
>
  <slot />
</a>
