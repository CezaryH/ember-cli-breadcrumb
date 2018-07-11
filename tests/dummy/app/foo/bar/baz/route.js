import Route from '@ember/routing/route';
import { computed, set } from '@ember/object';
export default Route.extend({
    breadCrumb: computed(() => ({
        title: 'test',
        test: 0
    })),
    init() {
        this._super(...arguments);
        setInterval(() => {
            set(this, 'breadCrumb.title', Date.now());
            set(this, 'breadCrumb.test', Date.now() - 1000);
        }, 1000);
    }
});
