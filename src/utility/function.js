import axios from 'axios'

export const addItemToCollection = async (item, session) => {
    const product = {
        SKU: item.SKU, name: item.name, price: item.price, image: item.image, brand: item.brand, color: item.color,
    }

    // Sending the product as an action to the redux store.... collection slice
    // Saving the reference to the product with user.
    await axios.post('/api/saveCollection', {
        session,
        product,
    });
console.log('session', session)
    const response = await axios.post('/api/retrieveCollection', {
        session,
        value: 2,
    });
    console.log('response', response)
    return response.data.data
}

export const addItemToBasket = async (item, size, session) => {
    const product = {
        SKU: item.SKU, name: item.name, price: item.price, image: item.image, brand: item.brand, color: item.color, size,
    }
    const response = await axios.post('/api/saveBasket', {
        session,
        product,
    });
    
}

export const removeItemFromBasket = async (item, session) => {
    const product = {
        SKU: item.SKU, name: item.name, price: item.price, image: item.image, brand: item.brand, color: item.color,
    }
    const response = await axios.post('/api/removeBasket', {
        session,
        product,
    });
}

