import { marked } from 'marked';
import { debounce } from 'lodash-es';

export default {
  data: () => ({
    input: '# hello',
  }),
  computed: {
    output() {
      return marked(this.input);
    },
  },
  methods: {
    update: function(e) {
      this.input = e.target.value;
    },
  },
};
