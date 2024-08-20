const importNanoid = async () => {
  try {
    const nanoidModule = await import("nanoid")
    return nanoidModule.nanoid
  } catch (error) {
    console.log("Error saat mengimpor modul nanoid:", error);
    return null;
  }
}

const generateOrderId = async () => {
  const nanoid = await importNanoid();

  return `TRX-${nanoid(4)}-${nanoid(8)}`;
};

const generateOrderItemsId = async () => {
  const nanoid = await importNanoid()
  
  return `TRX-ITEM-${nanoid(10)}`
}

module.exports = {
  generateOrderId,
  generateOrderItemsId
};