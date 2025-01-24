import Server from '@/host/Server';
import { API, Response } from '@/host/ServerApi';

export async function getProductList() {
  const response = await API.get('productv2/list/');
  return new Response(response.data);
}
export async function addProduct(content: any) {
  const response = await API.post('productv2/', { content });
  return new Response(response.data);
}
export async function removeProduct(id: string) {
  const response = await API.delete(`productv2/id/${id}`);
  return new Response(response.data);
}
export async function updateProductTitle(id: string, title: string) {
  const response = await API.put('productv2/title/', {
    content: { productId: id, title },
  });
  return new Response(response.data);
}
export async function updateProductDescription(
  id: string,
  description: string,
) {
  const response = await API.put('productv2/description/', {
    content: { productId: id, description },
  });
  return new Response(response.data);
}
export async function updateProductBrand(id: string, brandId: string) {
  const response = await API.put('productv2/brandId/', {
    content: { productId: id, brandId },
  });
  return new Response(response.data);
}
export async function updateProductCategory(id: string, categoryId: string) {
  const response = await API.put('productv2/categoryId/', {
    content: { productId: id, categoryId },
  });
  return new Response(response.data);
}
export async function updateProductAvailability(
  id: string,
  isAvailable: boolean,
) {
  const response = await API.put('productv2/isAvailable/', {
    content: { productId: id, isAvailable },
  });
  return new Response(response.data);
}
export async function updateProductSecondHand(
  id: string,
  isSecondHand: boolean,
) {
  const response = await API.put('productv2/isSecondHand/', {
    content: { productId: id, isSecondHand },
  });
  return new Response(response.data);
}
export async function updateProductPrice(id: string, price: any) {
  const response = await API.put('productv2/price/', {
    content: { productId: id, price },
  });
  return new Response(response.data);
}
export async function addProductBundle(id: string, bundle: any) {
  const response = await API.post('productv2/bundle/', {
    content: { productId: id, bundle },
  });
  return new Response(response.data);
}
export async function addProductGift(id: string, gift: any) {
  const response = await API.post('productv2/gift/', {
    content: { productId: id, gift },
  });
  return new Response(response.data);
}
export async function addProductSpecification(id: string, specification: any) {
  const response = await API.post('productv2/specification/', {
    content: { productId: id, specification },
  });
  return new Response(response.data);
}
export async function updateProductSpecifications(
  id: string,
  specifications: any[],
) {
  const response = await API.put('productv2/specification/list/', {
    content: { productId: id, specifications },
  });
  return new Response(response.data);
}
export async function addProductImage(id: string, imageForm: any) {
  const response = await API.postForm(`productv2/id/${id}/image/`, imageForm);
  return new Response(response.data);
}

export default class Product {
  static removeBundle(id: string, bundle: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path('productv2/bundle/')
      .bodyJson({ content: { productId: id, bundle: bundle } })
      .sendJson();
  }
  static removeGift(id: string, gift: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path('productv2/gift/')
      .bodyJson({ content: { productId: id, gift } })
      .sendJson();
  }
  static removeSpecification(id: string, specification: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path('productv2/specification/')
      .bodyJson({ content: { productId: id, specification } })
      .sendJson();
  }
  static removeImage(id: string, image: any): Promise<any> {
    return Server.request()
      .DELETE()
      .path(`productv2/id/${id}/image/`)
      .bodyJson({ content: { image } })
      .sendJson();
  }
}
