import moment from 'moment';
import {strings} from '../i18n';
import {capitalize} from './genericUtils';

export const convertToBluetoothPrintData = (
  data: any,
  orderingItems: any[],
) => {
  console.log(data);
  const newData = {
    payment: {
      method:
        data?.method == 'pickup'
          ? strings.ctPickUp
          : data?.method == 'walkup'
          ? strings.ctWalkUp
          : strings.ctDelivery,
      status: capitalize(
        data?.paymentStatus === 'paid' ? strings.ctPaid : strings.ctNotPaid,
      ),
      deliveryAddress: data?.deliveryAddress?.formatted_address ?? '',
      orderId: data?.orderNum,
    },
    customer: {
      name: data?.customer?.name,
      phone: `${data?.customer?.phone}`,
      note: data.note,
      time:
        data?.orderTiming === 'later'
          ? moment(data?.scheduledOn).format('MM/DD/YYYY [...] hh:mm A')
          : data?.orderTiming === 'now'
          ? `${strings.ctNow} ... ${moment(data?.orderNowPickupDate).format(
              'hh:mm A',
            )}`
          : '',
    },
    itemsDetails: data?.items?.map((item: any) => {
      const grouped = item?.modifiers?.reduce((acc: any, it: any) => {
        if (!acc[it?.size]) {
          acc[it?.size] = [];
        }
        acc[it?.size].push(it);
        return acc;
      }, {});
      const modifierGroupData = Object.keys(grouped)
        .map(size => {
          if (size !== 'undefined') {
            return grouped[size].map((gi: any) => ({
              name: `${capitalize(gi?.size)} - ${capitalize(
                gi.product_name,
              )} ${capitalize(gi.type === 'extra' ? 'x2' : '')}`,
              price:
                gi?.type === 'regular' &&
                (gi?.size === 'left' || gi?.size === 'right')
                  ? `${Number(gi?.halfPrice * item.qty).toFixed(2)}`
                  : gi?.type === 'regular' && gi?.size === 'all'
                  ? `${Number(gi?.price * item.qty).toFixed(2)}`
                  : gi?.type === 'extra' && gi?.size === 'all'
                  ? `${Number(gi?.extraPrice * item.qty).toFixed(2)}`
                  : (gi?.type === 'extra' && gi?.size === 'left') ||
                    gi?.size === 'right'
                  ? `${Number((gi?.extraPrice / 2) * item.qty).toFixed(2)}`
                  : '',
              selectedSubModifier: {
                name: gi?.selectedModifier?.label || '',
                price: Number(gi?.selectedModifier?.value || 0)?.toFixed(2),
              },
            }));
          }
        })
        .filter(g => g);
      console.log('modifierGroupData', modifierGroupData);
      const modifierNonGroupData = item?.modifiers
        ?.filter((item: any) => !item?.defaultSelected)
        ?.map((it: any, ind: number) => {
          let newPrice;
          if (it?.qty && it?.qty > 1) {
            newPrice = it?.price * it?.qty;
          } else {
            newPrice = it?.price * 1;
          }

          const modifierSelectdPrice =
            it?.selectedModifier?.label?.split('$')[1] === undefined
              ? 0
              : it?.selectedModifier?.label?.split('$')[1];
          if (!it?.advancedPizzaOptions) {
            return {
              name: `${it?.qty ? `${it?.qty} x ` : ''}${it?.product_name}`,
              price:
                newPrice > 0
                  ? Number(
                      Number(
                        Number(newPrice) -
                          Number(
                            it?.selectedModifier?.label.split('$')[1] || 0,
                          ),
                      ) * (item?.qty || 1),
                    ).toFixed(2)
                  : '-',
              selectedSubModifier: {
                name: it?.selectedModifier?.label
                  ? it?.selectedModifier?.label.split('$')[0].split(' -')[0]
                  : '',
                price: Number(modifierSelectdPrice * (it?.qty || 1)).toFixed(2),
              },
            };
          }
        })
        .filter((g: any) => g);
      console.log('modifierNonGroupData', modifierNonGroupData);

      let o = orderingItems.find(itm => itm._id === item.itemId);
      const allSubprods = Object.values(o?.modifiers || {}).flatMap(
        (modif: any) => modif?.subProducts,
      );

      const allSelectedModifiers = allSubprods.filter(
        subProd => subProd?.defaultSelected,
      );

      console.log(allSelectedModifiers, item?.modifiers);

      const missingSelected = allSelectedModifiers.filter(
        a => !item?.modifiers.some((m: any) => a.product_id === m.product_id),
      );

      const missedData = missingSelected.map(selected => ({
        name: `No ${selected?.product_name}`,
        price: '-',
        selectedSubModifier: {
          name: '',
          price: Number(0).toFixed(2),
        },
      }));

      const finalModifierData = modifierGroupData
        .flat(1)
        .concat(missedData)
        .concat(modifierNonGroupData);

      console.log('finalModifierData', finalModifierData);
      return {
        productName: item?.name,
        qty: item?.qty,
        price: item?.price?.toFixed(2),
        instruction: item?.instruction,
        modifier: finalModifierData,
      };
    }),
    totalDetails: [
      {
        label: 'Sub Total',
        value: data?.payment?.subTotal?.toFixed(2),
        // moreInfo: [],
      },
      {
        label: 'Coupon',
        value: data?.payment?.discount?.toFixed(2),
        // moreInfo: [],
      },
      {
        label: 'Tip',
        value: data?.payment?.tip?.toFixed(2),
        // moreInfo: [],
      },
      {
        label: 'Tax & fees',
        value: data?.payment?.tax?.toFixed(2),
        // moreInfo: [
        //   {
        //     label: 'Delivery Fee',
        //     value: Math.round(data?.payment?.deliveryFee * 100) / 100,
        //   },
        //   {
        //     label: 'Other Fees',
        //     value:
        //       Math.round(
        //         (data?.payment?.tax - data?.payment?.deliveryFee) * 100,
        //       ) / 100,
        //   },
        // ],
      },
      {
        label: 'Total',
        value: data?.payment?.total?.toFixed(2),
        // moreInfo: [],
      },
    ],
  };
  console.log('convertToBluetoothPrintData', newData);
  return newData;
};
