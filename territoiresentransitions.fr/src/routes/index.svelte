<script context="module">
  export const hydrate = false;
  export const prerender = true;

  export async function load({ fetch }) {
    const fetcher = async (file) => await fetch('/bridge?file=' + file);

    const [description, buttons, cards, howToStart, contactUs] = await Promise.all([
      fetcher('home/description.md'),
      fetcher('home/buttons.md'),
      fetcher('home/cards.md'),
      fetcher('home/how-to-start.md'),
      fetcher('home/contact-us.md')
    ]);

    return {
      props: {
        description: await description.text(),
        buttons: await buttons.text(),
        cards: await cards.text(),
        howToStart: await howToStart.text(),
        contactUs: await contactUs.text()
      }
    };
  }
</script>

<script>
  import SvelteMarkdown from 'svelte-markdown';
  import Title from '../components/Markdown/Title.svelte';
  import Cards from '../components/Markdown/Cards.svelte';
  import Link from '../components/Markdown/Link.svelte';
  import LinkBtn from '../components/Markdown/LinkBtn.svelte';
  import HomeParagraph from '../components/Markdown/HomeParagraph.svelte';
  import Container from '../components/Layout/Container.svelte';

  export let description;
  export let buttons;
  export let cards;
  export let howToStart;
  export let contactUs;

  const renderers = {
    heading: Title,
    link: Link,
    paragraph: HomeParagraph
  };

  const btnRenderers = {
    link: LinkBtn
  };
</script>

<svelte:head>
  <title>Territoires en transitions</title>
</svelte:head>

<main role="main">
  <div id="contenu" class="fr-container-fluid ds_banner">
    <Container>
      {#if description}
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-mt-3w fr-mt-md-9w fr-mb-5w text-center">
            <SvelteMarkdown source={description} {renderers} />
          </div>
        </div>
      {/if}
    </Container>

    <Container>
      <div class="fr-grid-row fr-grid-row--gutters">
        <SvelteMarkdown source={cards} {renderers} />
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <Cards />
      </div>
    </Container>

    <Container classNames="fr-mt-10w">
      {#if howToStart}
        <div class="fr-grid-row fr-grid-row--gutters">
          <SvelteMarkdown source={howToStart} {renderers} />
        </div>
      {/if}
      {#if buttons}
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mb-10w">
          <SvelteMarkdown source={buttons} renderers={btnRenderers} />
        </div>
      {/if}
    </Container>

    <Container classNames="fr-mt-10w">
      <div class="fr-grid-row fr-grid-row--gutters">
        <SvelteMarkdown source={contactUs} {renderers} />
      </div>
    </Container>
  </div>
</main>

<style>
  @media screen and (min-width: 640px) {
    .container {
      padding-right: 6rem;
      padding-left: 6rem;
    }
  }
</style>
