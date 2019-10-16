<template>
    <div>
        
    </div>
</template>

<script>


export default {
    name: 'ui-autocomplete',
    methods: {
        selectSuggestion(suggestion) {

            if (this.append) {
                value += this.appendDelimiter + (suggestion[this.keys.value] || suggestion);
            } else {
                value = suggestion[this.keys.value] || suggestion;
            }

            this.updateValue(value);
            this.$emit('select', suggestion);

            this.$nextTick(() => {
                this.closeDropdown();
                this.$refs.input.focus();
            });
        }
    },
};
</script>

