import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {PrimaryText} from '../../components';
import {strings} from '../../i18n';
import {colors, commonStyles, fonts} from '../../styles';

const GroupedPizzaToppings = ({
  data,
  it,
  viewOrder = false,
}: {
  data: any[];
  it: any;
  viewOrder?: boolean;
}) => {
  const [groupedData, setGroupedData] = useState<any>({});

  useEffect(() => {
    const grouped = data?.reduce((acc, item) => {
      if (!acc[item?.size]) {
        acc[item?.size] = [];
      }
      acc[item?.size].push(item);
      return acc;
    }, {});
    setGroupedData(grouped);
  }, []);

  return (
    <>
      {!viewOrder ? (
        <View>
          {Object.keys(groupedData).map(size => {
            if (size !== 'undefined') {
              return (
                <View
                  style={{
                    marginTop: 18,
                  }}
                  key={size}>
                  <PrimaryText
                    style={{
                      ...fonts.medium36,
                      color: colors.blackText,
                      textTransform: 'capitalize',
                    }}
                    key={size}>
                    {size}
                  </PrimaryText>
                  {groupedData[size].map((item: any) => {
                    if (item.advancedPizzaOptions) {
                      return (
                        <View
                          style={commonStyles.horizontalBetweenStyles}
                          key={item.product_id}>
                          <PrimaryText
                            style={{
                              ...fonts.medium36,
                              color: colors.bannerHeadingText,
                              textTransform: 'capitalize',
                            }}>
                            {`${item.product_name} ${
                              item.type === 'extra' ? 'x2' : ''
                            }`}
                          </PrimaryText>
                          <PrimaryText
                            style={{
                              ...fonts.medium36,
                              color: colors.blackText,
                            }}>
                            {item?.type === 'regular' &&
                            (item?.size === 'left' || item?.size === 'right')
                              ? `${strings.currency}${Number(
                                  item?.halfPrice * it.qty,
                                ).toFixed(2)}`
                              : item?.type === 'regular' && item?.size === 'all'
                              ? `${strings.currency}${Number(
                                  item?.price * it.qty,
                                ).toFixed(2)}`
                              : item?.type === 'extra' && item?.size === 'all'
                              ? `${strings.currency}${Number(
                                  item?.extraPrice * it.qty,
                                ).toFixed(2)}`
                              : (item?.type === 'extra' &&
                                  item?.size === 'left') ||
                                item?.size === 'right'
                              ? `${strings.currency}${Number(
                                  (item?.extraPrice / 2) * it.qty,
                                ).toFixed(2)}`
                              : ''}
                          </PrimaryText>
                        </View>
                      );
                    }
                  })}
                </View>
              );
            }
          })}
        </View>
      ) : (
        <View style={commonStyles.horizontalBetweenStyles}>
          {Object.keys(groupedData).map(size => {
            if (size !== 'undefined') {
              return (
                <PrimaryText
                  style={{
                    ...fonts.medium36,
                    color: colors.bannerHeadingText,
                    textTransform: 'capitalize',
                  }}
                  key={size}>
                  {groupedData[size].map((item: any) => {
                    if (item.advancedPizzaOptions) {
                      return (
                        <PrimaryText
                          style={{
                            ...fonts.medium36,
                            color: colors.blackText,
                          }}
                          key={item.product_id}>
                          {`(${size} - ${item.product_name} ${
                            item.type === 'extra' ? 'x2' : ''
                          } `}

                          {item?.type === 'regular' &&
                          (item?.size === 'left' || item?.size === 'right')
                            ? `${strings.currency}${Number(
                                item?.halfPrice * it.qty,
                              ).toFixed(2)}),`
                            : item?.type === 'regular' && item?.size === 'all'
                            ? `${strings.currency}${Number(
                                item?.price * it.qty,
                              ).toFixed(2)}),`
                            : item?.type === 'extra' && item?.size === 'all'
                            ? `${strings.currency}${Number(
                                item?.extraPrice * it.qty,
                              ).toFixed(2)}),`
                            : (item?.type === 'extra' &&
                                item?.size === 'left') ||
                              item?.size === 'right'
                            ? `${strings.currency}${Number(
                                (item?.extraPrice / 2) * it.qty,
                              ).toFixed(2)}),`
                            : ' '}
                        </PrimaryText>
                      );
                    }
                  })}
                </PrimaryText>
              );
            }
          })}
        </View>
      )}
    </>
  );
};

export default GroupedPizzaToppings;
