<script>
	import Loadingv1 from "@/components/Loading";
	import Input from "@/components/Input.vue";
	import Button2 from "@/components/button/Button2.vue";
	import Actionbar from "@/components/actionbar/Actionbar.vue";
	import Footer from "@/app/footer/Footer.vue";

	export default {
		title: "Staff Login",

		components: { Loadingv1, Input, Button2, Actionbar, Footer },
		data() {
			return {
				top: { shadow: false },
				usernameErrorText: "",
				passwordErrorText: "",
			};
		},
		computed: {
			isLoading: (c) => c.loginStore.getters.isLoading,
		},
		methods: {
			clickLogin() {
				let redirect = this.$route.query.redirect ?? "/home";

				const username = this.$refs.username.value;
				const password = this.$refs.password.value;
				this.usernameErrorText = "";
				this.passwordErrorText = "";

				if (username === "") this.usernameErrorText = "Missing Field";
				if (password === "") this.passwordErrorText = "Missing Field";
				if (username === "" || password == "") return;

				this.loginStore
					.dispatch("login", { username, password })
					.then((user) => setTimeout(() => this.$router.push(redirect), 200))
					.catch(() => {
						this.$root.feedback("Login failed");
						this.usernameErrorText = "Check your username";
						this.passwordErrorText = "Check your password";
					});
			},
		},
		async mounted() {
			let user = await this.loginStore.dispatch("getUser");
			if (!user) return;
			if (!this.$route.query.redirect) return;
			this.$router.replace({ path: this.$route.query.redirect });
		},
	};
</script>

<template>
	<div class="PageLogin">
		<Loadingv1 class="PageLogin-Loading" :isRunning="isLoading" />

		<div
			class="PageLogin-body"
			@scroll="(event) => (top.shadow = event.target.scrollTop > 0)"
		>
			<Actionbar
				class="PageLogin-top"
				:class="[top.shadow ? 'PageLogin-top-shadow' : '']"
				v-if="$root.navigation.isDrawer()"
				:leftMenus="[
					{
						key: 'home',
						title: 'Home',
						icon: this.host.res('img/freshnet-enterprise-logo.svg'),
						click: () => this.$router.push('/home'),
					},
					{
						title: 'Hamburger Menu',
						icon: host.res('icon/hamburgerMenu-2A4858.svg'),
						click: () => $root.openNavigationDrawer(),
					},
				]"
			/>

			<div class="PageLogin-main">
				<div class="PageLogin-form">
					<div class="PageLogin-header">
						<span class="PageLogin-title">Staff Login</span>
					</div>

					<form class="PageLogin-content" @submit.prevent="clickLogin()">
						<Input
							class="PageLogin-input"
							ref="username"
							label="Username"
							type="text"
							@input="
								(comp) => {
									let value = comp.value;
									if (value.includes(''))
										comp.value = value.trim().replace(' ', '');
								}
							"
							:isRequired="true"
							:error="usernameErrorText"
						/>
						<Input
							class="PageLogin-input"
							ref="password"
							label="Password"
							type="password"
							:isRequired="true"
							:error="passwordErrorText"
						/>

						<Button2 class="PageLogin-button" text="Login" />
					</form>
				</div>
			</div>

			<Footer />
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.PageLogin {
		--page-background-color: #c9d7df;
		--page-background-color-shadow: #b6b6b6;

		background: var(--page-background-color);
		color: #2a4858;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: stretch;
		position: relative;

		--max-width: 650px;
		--max-width: 28em;

		.PageLogin-Loading {
			z-index: 3;
			position: absolute;
			top: 0;
			width: 100%;
		}

		.PageLogin-body {
			z-index: 1;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			position: relative;
			overflow-x: hidden;
			overflow-y: auto;

			.PageLogin-top {
				top: 0;
				right: 0;
				left: 0;
				z-index: 2;
				width: 100%;
				background: #d6e1e5;
				position: sticky;
				transition: var(--animation-duration);

				.PageLogin-top-logo {
					--size: 2.8rem;

					width: var(--size);
					height: var(--size);
					min-width: var(--size);
					min-height: var(--size);
					max-width: var(--size);
					max-height: var(--size);
					background: none;
					border: none;
					cursor: pointer;
					padding: 0.6rem;
					border-radius: 50%;
					transition: var(--animation-duration);
					display: flex;
					flex-grow: 0;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					&:hover {
						background: hsla(0, 0%, 0%, 0.1);
						background: #49748940;
					}
					&-img {
						height: 100%;
						width: 100%;
					}
				}
			}
			.PageLogin-top-shadow {
				box-shadow: 0 0 3rem rgba(0, 0, 0, 0.1);
			}

			.PageLogin-main {
				width: 100%;
				height: 80%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.PageLogin-form {
					z-index: 1;
					width: 100%;
					max-width: var(--max-width);
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: flex-start;
					gap: 1em;
					padding: 2em;

					.PageLogin-header {
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;
						.PageLogin-title {
							font-size: 4rem;
							opacity: 0.6;
							line-height: 1.4;
						}
						.PageLogin-description {
							font-weight: 400;
							font-size: 1.2rem;
						}
					}

					.PageLogin-content {
						width: 100%;
						padding: 20px 0;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						gap: 14px;

						& > * {
							width: 100%;
						}

						.PageLogin-input {
							padding: 0.8rem 1rem;
						}

						.PageLogin-button {
							max-width: 200px;
							margin-top: 20px;
							padding: 10px;
						}
					}
				}
			}
		}
	}
</style>
