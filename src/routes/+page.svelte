<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { isMobile, isReady } from '$src/stores/mobile';
	// import { getFileUrl } from '$lib/api/data';
	// import { session } from '$app/stores';
	// import { lazyLoad } from '$lib/lazyLoad';
	// import { providerData } from '$stores/provider';
	// import Footer from '$lib/components/Footer.svelte';

	export let data;
	// const profileData: Profile = getContext('profile');

	let mascotHeight = 0,
		isPortraitMobile = false;

	onMount(() => {
		console.log('ENV', data);
		mascotHeight = ((62 / 100) * window.innerHeight) / 16;
		if (window) {
			isPortraitMobile = window.innerWidth < window.innerHeight;
		}
	});
</script>

<svelte:head>
	<style>
		html {
			background-color: #00d1c5;
		}
	</style>
</svelte:head>

<main class="">
	<!-- <div class="content">
		<div class="text-left lg:text-center flex items-center">
			{#if $providerData?.photoUrl}
				{#await getFileUrl($providerData?.photoUrl, $session, env?.baseApi)}
					<img
						src={'/images/home/placeholder-hospital.svg'}
						class="hospital-logo block mr-4 w-8 h-8 lg:w-14 lg:h-14 rounded-full"
						alt=""
					/>
				{:then imageUrl}
					<figure>
						<img
							class="hospital-logo block mr-4 w-8 h-8 lg:w-14 lg:h-14 rounded-full"
							use:lazyLoad={imageUrl}
							alt="logo"
						/>
					</figure>
				{/await}
			{:else}
				<img
					src={'/images/home/placeholder-hospital.svg'}
					class="hospital-logo block mr-4 w-8 h-8 lg:w-14 lg:h-14 rounded-full"
					alt=""
				/>
			{/if}

			<h1>{profileData?.name || ''}</h1>
		</div>
		<div class="mt-6 md:mt-8 lg:mt-12 text-sm sm:text-lg leading-normal text-white">
			<div>Selamat datang,</div>
			<div>Silakan pilih menu portal</div>
		</div>
	{#if $isReady}-->
	<div class="card-group lg:grid lg:grid-cols-3 gap-x-6 mt-4 text-lg leading-normal text-white">
		<a href="/appointment" class="card appointment">
			<div class="title"><span>Janji Temu</span></div>
			<img src="/images/home/bg-appointment{$isMobile ? '-mobile' : ''}.svg" alt="Janji Temu" />
			<span class="caret-right" />
		</a>
		{#if data?.isQueueActive}
			<a href="/queue" class="card queue">
				<div class="title"><span>Antrian</span></div>
				<img src="/images/home/bg-queue{$isMobile ? '-mobile' : ''}.svg" alt="Janji Temu" />
				<span class="caret-right" />
			</a>
		{/if}
		<a href={data?.tpaURL || ''} target="_blank" class="card insurance">
			<div class="title"><span>Penjaminan Asuransi Vida</span></div>
			<img src="/images/home/bg-insurance{$isMobile ? '-mobile' : ''}.svg" alt="Janji Temu" />
			<span class="caret-right" />
		</a>
	</div>
	<!--{/if}
	
	</div>
	<div class="mascot hidden lg:block">
		<img src="/images/home/mascot.svg" alt="Mascot" style="height:{mascotHeight}rem;" />
	</div>
	<div class="footer hidden lg:block"><Footer /></div> -->
</main>

<style>
	main {
		background-image: url('/images/home/gradient-clover.svg');
		background-size: auto 87%;
		background-position: bottom right;
		background-repeat: no-repeat;
		height: calc(100vh - 3.5rem);
	}

	.content {
		padding: 7.5rem 0 0 0;
	}

	.content .hospital-logo {
		filter: drop-shadow(0px 6px 20px rgba(0, 0, 0, 0.07));
	}

	.content > div {
		margin-left: 9.75rem;
	}

	h1 {
		font-family: Museo, sans-serif;
		font-weight: 600;
		font-size: 2rem;
		line-height: 1.3;
		color: #ffffff;
	}

	.mascot {
		position: absolute;
		right: 10rem;
		bottom: 0;
	}

	.card-group {
		width: 47.4%;
	}

	.card {
		display: flex;
		align-items: flex-end;
		border-radius: 1rem;
		overflow: hidden;
		padding-top: 1.75rem;
		position: relative;
		cursor: pointer;
	}

	.card .title {
		font-family: 'Museo', 'sans-serif';
		position: absolute;
		top: 0.75rem;
		text-align: center;
		width: calc(100% - 3.5rem);
		height: 2.75rem;
		margin: 0 1.75rem;
		font-size: 1.125rem;
		line-height: 1.2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card > img {
		width: 100%;
	}

	.card.appointment {
		background: #3989d7;
	}

	.card.queue {
		background: #e2bd30;
	}

	.card.insurance {
		background: #f88449;
	}

	.footer {
		position: absolute;
		left: 0;
		bottom: 2.125rem;
		width: 100%;
		text-align: center;
		color: #f5f5f5;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	@media screen and (max-width: 1280px) {
		.content {
			padding: 4rem 0 0 0;
		}
	}

	@media screen and (max-width: 1024px) {
		.content {
			padding: 1.5rem 0 0 0;
		}

		.card {
			margin-bottom: 1rem;
			padding-top: 0;
			align-items: center;
			justify-content: end;
		}

		.content > div {
			padding: 0 5rem;
			margin-left: 0;
		}

		.card-group {
			width: 100%;
		}

		.card .title {
			top: 0;
			height: 100%;
			font-size: 1.8rem;
			line-height: 1.5;
			text-align: left;
		}

		.card .title span {
			width: 10rem;
			margin-left: 1rem;
		}

		.card.appointment,
		.card.queue,
		.card.insurance {
			background: transparent;
		}

		.mascot {
			bottom: 4rem;
		}

		.mascot > img {
			height: 20rem !important;
		}

		h1 {
			font-size: 1.5rem;
			line-height: 1.5;
		}

		.caret-right {
			background-image: url('/images/caret-right-white.svg');
			background-position: bottom right;
			background-repeat: no-repeat;
			background-size: contain;
			display: block;
			width: 0.8rem;
			height: 1.35rem;
			position: absolute;
			right: 1.75rem;
		}
	}

	@media screen and (max-width: 640px) {
		.content > div {
			padding: 0 1rem;
		}

		.card {
			margin-bottom: 0.75rem;
		}

		h1 {
			font-size: 1rem;
			line-height: 1.5;
		}

		.card .title {
			font-size: 1.125rem;
			line-height: 1.5;
		}

		.card .title span {
			width: 8rem;
		}

		.caret-right {
			width: 0.51rem;
			height: 0.86rem;
		}
	}
</style>
