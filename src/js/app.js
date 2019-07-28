import throttle from 'lodash.throttle';
import WorkApp from './work';

const bodyModalClass = 'modal-open';
const modalActiveClass = 'active';

export default class App {
  constructor(params={}){
    this.params = params;
    window.addEventListener('DOMContentLoaded', () => this.ready());
  }
  ready(){
    this.modalWrapper = document.getElementById('modal-wrapper');
    this.bindModalEvents();
    this.stylizeHeadings();
    this.stickyHeader();

    document.querySelectorAll('.site-main .work-list').forEach(
      workAppRoot => new WorkApp({ root: workAppRoot })
    );

    // make all external links open in new tab
    document.querySelectorAll('a[href]')
      .forEach(
        link => {
          const href = link.getAttribute('href');
          if(
            /^http/ig.test(href) &&
            !/^\//.test(href) &&
            href.indexOf(window.location.origin) !== 0
          ){
            link.setAttribute('target', '_blank');
          }
        }
      );

  }

  stickyHeader(){
    const stickyWrapper = document.createElement('div');
    const header = document.querySelector('.site-header');

    stickyWrapper.classList.add('sticky-wrapper');
    header.parentNode.insertBefore(stickyWrapper, header);
    stickyWrapper.appendChild(header);

    const applyHeaderStyles = () => {
      stickyWrapper.style.height = `${header.offsetHeight}px`;
    };

    window.addEventListener(
      'resize',
      throttle(applyHeaderStyles, 500)
    );

    applyHeaderStyles();
  }

  stylizeHeadings(){
    const headings = document.querySelectorAll('.hero h1, .hero h2, .post-card h3');
    headings.forEach(
      heading => {
        heading.innerHTML = heading.textContent.split(' ')
          .map(
            word => `<span>${word}</span>&nbsp;`
          )
          .join('');
      }
    );
  }

  bindModalEvents(){
    // global event delegator
    document
      .addEventListener(
        'click',
        (e) => {
          switch(true){
            case (e.target.matches('a[rel="modal"]')):
              this.openModalFromLink(e.target);
              e.preventDefault();
              break;
            case (e.target.matches('.modal')):
              this.closeModal();
              break;
          }
        }
      );

    document.querySelectorAll('a[rel="modal"]')
      .forEach(
        link => {
          link.addEventListener(
            'click',
            e => {
              this.openModalFromLink(link);
              e.preventDefault();
            }
          )
        }
      );

    // block links on modal content from bubbling up
    this.modalWrapper.querySelector('.inner')
      .addEventListener(
        'click',
        e => {
          e.stopPropagation()
        }
      );

    document.querySelectorAll('.modal-close')
      .forEach(
        link => link.addEventListener(
          'click',
          e => {
            this.closeModal();
            e.preventDefault();
          }
        )
      );
  }

  openModalFromLink(link){
    this.openModal(this.modalWrapper.querySelector(link.getAttribute('href')));
  }
  openModal(modal){
    if(modal){
      this.closeModal();
      this.modal = modal;
      this.modal.classList.add(modalActiveClass);
      document.body.classList.add(bodyModalClass);
    }
  }
  closeModal(){
    if(this.modal){
      this.modal.classList.remove(modalActiveClass);
      document.body.classList.remove(bodyModalClass);
      this.modal = null;
    }
  }
}
