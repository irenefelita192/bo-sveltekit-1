<script lang="ts">
</script>

<div class="loader">
    <img src="/images/vida-logo.svg" alt="Vida" />
</div>

<style>
    @keyframes blink {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
        100% {
            opacity: 1;
        }
    }
    .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: blink normal 2s infinite ease-in-out;
    }
</style>
