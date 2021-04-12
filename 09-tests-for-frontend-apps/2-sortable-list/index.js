export default class SortableList {
    constructor(
        items = {}
    ) {
        this.items = items.items;

        this.render();
    }

    getTemplate() {
        const ul = document.createElement('ul');

        this.items.forEach((element, index) => {
            element.setAttribute('data-element', `li-${index}`);
            ul.append(element)
        });

        this.element = ul;
    }


    render() {
        this.getTemplate();

        this.addEventListeners();
    }

    addEventListeners() {
        this.element.addEventListener('mousedown', (event) => {
            const target = event.target.closest('[data-element]');

            if(target) {
                target.style.position = 'absolute';
                target.style.zIndex = 100;
                document.body.append(target);
                document.addEventListener('mousemove', this.moveElement(target))
                // document.addEventListener('mouseup', this.stopElement());
            }
        })

    }
    
    moveElement = (target, event) => {
        console.log(target)
        target.style.left = event.pageX + 'px';
        target.style.top = event.pageY + 'px';
        // console.log(target.style.top);
    }

    // stopElement = () => {
    //     console.log('stop!')
    //     document.removeEventListener('mousemove', this.moveElement(target, event))
    // }
    
}
