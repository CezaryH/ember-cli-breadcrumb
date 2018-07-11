import Component from '@ember/component';
import layout from './template';
import { computed, get } from '@ember/object';
import { bool, alias, readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';
import { isNone } from '@ember/utils';


var CrumbObject = EmberObject.extend({
  _route: computed(() => ({
    breadCrumb: {}
  }))
});

export default Component.extend({
  router: service(),
  layout,
  tagName: 'ol',
  linkable: true,
  classNameBindings: ['breadCrumbClass'],
  hasBlock: bool('template').readOnly(),
  currentRouteName: alias('router.currentRouteName'),
  currentRouteNameArray: computed('currentRouteName', function() {
    return get(this, 'currentRouteName').split('.');
  }),
  routeNames: computed('currentRouteName', function() {
    let currentRouteNameArray = get(this, 'currentRouteNameArray');
    return currentRouteNameArray.reduce((arr, routeName) => {
      let [name] = arr.slice(-1);
      if(name) {
          arr.push([name, routeName].join('.'));
      } else {
        arr.push(routeName);
      }

      return arr;
    }, []);
  }),
  crumbs: computed('routeNames', function() {
    let routeNames = get(this, 'routeNames');
    return routeNames.map(routeName => {
      return  this._buildCrumb(routeName);
    }).filter(i => !isNone(i));
  }),
  _lookupRoute(routeName) {
    return getOwner(this).lookup(`route:${routeName}`);
  },
  _buildCrumb(routeName) {
    let route = this._lookupRoute(routeName);
    if(get(route, 'breadCrumb')) {
      let crumb = {_route: route};
      let fields = Object.keys(route.breadCrumb).reduce((obj, fieldName) => Object.assign({}, obj, {
        [fieldName]: readOnly(`_route.breadCrumb.${fieldName}`)
      }), crumb);
      return CrumbObject.create(fields);
    }
    return null;
  }
});
