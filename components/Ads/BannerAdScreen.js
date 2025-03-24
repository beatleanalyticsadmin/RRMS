import React, { useState } from "react";
import { View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
const androidAdmobBanner = "ca-app-pub-6455906013208664/6286531770";
const productionID = androidAdmobBanner;

function BannerAdScreen() {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  return (
    <View style={{ height: isAdLoaded ? "auto" : 0 }}>
      <BannerAd
        // Use test IDs during development to avoid AdMob policy violations
        unitId={__DEV__ ? TestIds.BANNER : productionID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Show only non-personalized ads
          additionalRequestParameters: {
            max_ad_content_rating: "G", // Limit ad content to General audiences
            tag_for_under_age_of_consent: true, // Mark ad request as child-directed if needed
          },
        }}
        onAdLoaded={() => {
          setIsAdLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.error("Banner Ad Failed to Load:", error);
        }}
      />
    </View>
  );
}

export default BannerAdScreen;
