export default class WorkApp {
  constructor({ root }){
    this.root = root;
    this.init();
    return this;
  }
  init(){
    this.root.classList.add('hidden');
    this.workItems = this.root.querySelectorAll('.work-item');
    this.buildTagNav();

    const header = document.querySelector('.site-header');

    const readURLState = () => {
      const search = window.location.search.replace(/^\?/, '');
      this.activeFilters = new Set(
        search.replace(/^\?/, '')
          .split(',')
          .map(decodeURIComponent)
          .filter(s => s)
      );
      this.render();
    }

    readURLState();
    window.addEventListener(
      'popstate',
      e => {
        readURLState();
        window.scrollTo({
          left: 0,
          top: this.tagNav.offsetTop,
          behavior: 'smooth'
        });
      }
    );
    this.root.classList.remove('hidden');
  }
  buildTagNav(){
    this.tags = [];
    this.itemsMap = new Map();
    this.workItems.forEach(
      item => {
        const itemTags = item.getAttribute('data-tags').split(',');
        this.itemsMap.set(item, itemTags);
        this.tags = this.tags.concat(itemTags);
      }
    );

    // flatten and remove dupes
    this.tags = this.tags.reduce(
      (acc, v) => {
        if(acc.indexOf(v) === -1){
          acc.push(v);
        }
        return acc;
      },
      []
    )
    .filter(
      tag => tag !== 'work'
    );

    // build all tags
    this.tagNav = this.root.querySelector('nav.tag-nav');
    this.tags.forEach(
      tag => {
        const tagLink = document.createElement('a');
        tagLink.setAttribute('data-tag', tag);
        tagLink.setAttribute('href', '#');
        tagLink.textContent = tag;
        this.tagNav.appendChild(tagLink);
      }
    );

    this.tagLinks = this.root.querySelectorAll('a[data-tag]');

    this.tagLinks.forEach(
      tagLink => {
        const tag = tagLink.getAttribute('data-tag');
        tagLink.addEventListener(
          'click',
          e => {
            e.preventDefault();
            this.toggleFilter(tag);
          }
        );
      }
    )

  }

  toggleFilter(tag){
    if(this.activeFilters.has(tag)){
      this.activeFilters.delete(tag);
    }
    else {
      this.activeFilters.add(tag);
    }
    let newHash = [];
    this.activeFilters.forEach(
      filter => newHash.push(filter)
    );
    window.history.replaceState(null, null, `?${newHash.join(',')}`);
    this.render();
  }

  render(){
    if(this.initialRendered){
      window.scrollTo({
        left: 0,
        top: this.tagNav.offsetTop,
        behavior: 'smooth'
      });
    }
    this.tagLinks.forEach(
      tagLink => {
        let activeClass = 'active';
        if(this.activeFilters.size){
          this.activeFilters.has(tagLink.getAttribute('data-tag'))
            ? tagLink.classList.add(activeClass)
            : tagLink.classList.remove(activeClass);
        }
        else {
          tagLink.classList.add(activeClass);
        }
      }
    );

    this.workItems.forEach(
      item => {
        item.style.display = this.activeFilters.size
          ? (
            this.itemsMap.get(item).some(
              tag => this.activeFilters.has(tag)
            )
          )
            ? null
            : 'none'
          : null;
      }
    );

    this.initialRendered = true;

  }
}
