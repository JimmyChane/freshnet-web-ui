<script>
	import Section from "./PageHome-Section.vue";
	export default {
		components: { Section },
		props: { isThin: { type: Boolean, default: false } },
	};
</script>

<template>
	<Section class="HomeSectionAboutUs" :isThin="isThin" title="About Us">
		<p
			>Since 2009, from teaching computer class to repair computer, printers,
			networking, cctv services.</p
		>
	</Section>
</template>
