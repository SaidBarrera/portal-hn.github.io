// import { State } from '../utils/config.js';

// export function initializeTagSystem() {
//     const tagInput = document.getElementById('tagInput');
//     const addTagBtn = document.getElementById('addTagBtn');

//     if (tagInput && addTagBtn) {
//         tagInput.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 addTag(tagInput.value);
//             }
//         });

//         addTagBtn.addEventListener('click', () => {
//             addTag(tagInput.value);
//         });

//         document.querySelectorAll('.suggestion').forEach(suggestion => {
//             suggestion.addEventListener('click', () => {
//                 addTag(suggestion.dataset.tag);
//             });
//         });
//     }
// }

// export function addTag(tagText) {
//     tagText = tagText.trim();
//     if (tagText && !State.selectedTags.has(tagText)) {
//         State.selectedTags.add(tagText);
//         const tagElement = createTagElement(tagText);
//         document.getElementById('selectedTags').appendChild(tagElement);
//         document.getElementById('tagInput').value = '';
//     }
// }

// export function createTagElement(tagText) {
//     const tag = document.createElement('span');
//     tag.className = 'tag';
    
//     const textNode = document.createElement('span');
//     textNode.textContent = tagText;
    
//     const removeButton = document.createElement('span');
//     removeButton.className = 'remove-tag';
//     removeButton.innerHTML = '&times;';
//     removeButton.addEventListener('click', (e) => {
//         e.stopPropagation();
//         removeTag(tagText);
//     });
    
//     tag.appendChild(textNode);
//     tag.appendChild(removeButton);
    
//     return tag;
// }

// export function removeTag(tagText) {
//     State.selectedTags.delete(tagText);
    
//     const selectedTagsContainer = document.getElementById('selectedTags');
//     const tags = selectedTagsContainer.getElementsByClassName('tag');
    
//     Array.from(tags).forEach(tag => {
//         const tagContent = tag.childNodes[0].textContent.trim();
//         if (tagContent === tagText.trim()) {
//             tag.remove();
//         }
//     });
// }

// export function clearTags() {
//     State.selectedTags.clear();
//     const selectedTagsContainer = document.getElementById('selectedTags');
//     if (selectedTagsContainer) {
//         selectedTagsContainer.innerHTML = '';
//     }
// }

// export function filterJobsByTags(jobs, selectedTags) {
//     if (!selectedTags || selectedTags.size === 0) return jobs;
    
//     return jobs.filter(job => {
//         if (!job.tags) return false;
//         return Array.from(selectedTags).every(tag => job.tags.includes(tag));
//     });
// }
export function setupTagsInput(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tagsContainer = container.querySelector('.tags-container');
    const input = container.querySelector('input');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = input.value.trim();
            if (tag) {
                addTag(containerId, tag);
                input.value = '';
            }
        }
    });
}

export function addTag(containerId, tagText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tagsContainer = container.querySelector('.tags-container');
    const existingTags = Array.from(tagsContainer.children).map(tag => 
        tag.querySelector('span').textContent
    );

    if (existingTags.includes(tagText)) {
        showToast('Esta etiqueta ya existe', 'warning');
        return;
    }

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        <span>${tagText}</span>
        <button type="button" onclick="removeTag(this)">×</button>
    `;

    tagsContainer.appendChild(tag);
}

export function removeTag(button) {
    const tag = button.parentElement;
    tag.remove();
}

export function clearTags(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tagsContainer = container.querySelector('.tags-container');
    tagsContainer.innerHTML = '';
}

export function getTags(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return [];

    const tagsContainer = container.querySelector('.tags-container');
    return Array.from(tagsContainer.children).map(tag => 
        tag.querySelector('span').textContent
    );
}