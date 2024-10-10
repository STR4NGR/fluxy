<template>
    <div v-if="message" class="alert" :class="`alert-${type}`" role="alert">
        {{ message }}
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: false
        },
        type: {
            type: String,
            default: 'danger'
        }
    }
}
</script>

<style scoped>
.alert {
    margin-top: 20px;
}
</style>