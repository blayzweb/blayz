import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { BRAND, BRAND_COLORS } from "@/content/brand";
import {
  ADDONS,
  computeBreakdown,
  getTierById,
  isIncluded,
} from "@/content/pricing";
import { registerProposalFonts } from "@/lib/proposal/fonts";
import { PdfMoney } from "@/lib/proposal/DirhamMoney";
import type { ProposalInput } from "@/lib/proposal/types";
import type { Addon, TierId } from "@/content/pricing";

const LOGO_PATH =
  "M 912.92 588.95 C890.66,587.35 870.04,583.11 851.25,576.27 L 847.00 574.73 L 847.00 532.36 C847.00,509.06 847.34,490.00 847.75,490.00 C848.16,490.00 853.45,492.20 859.50,494.88 C900.62,513.12 944.74,518.41 980.50,509.38 C1011.69,501.50 1035.00,481.46 1049.16,450.34 C1051.67,444.82 1057.00,430.56 1057.00,429.37 C1057.00,429.21 1053.62,431.51 1049.49,434.48 C1029.54,448.79 1009.56,456.00 984.75,457.83 C919.97,462.61 868.04,427.83 853.03,369.62 C847.70,348.96 847.00,339.65 847.00,289.95 L 847.00 245.00 L 887.42 245.00 L 927.84 245.00 L 928.27 291.25 C928.66,334.39 928.84,338.17 930.90,347.50 C937.60,377.78 954.95,399.69 978.50,407.60 C989.40,411.27 1005.05,411.54 1015.50,408.26 C1036.20,401.76 1053.14,383.51 1061.45,358.74 C1066.43,343.90 1067.22,335.09 1067.73,288.28 L 1068.21 245.05 L 1101.85 244.78 C1120.36,244.62 1137.86,244.64 1140.75,244.80 L 1146.00 245.10 L 1146.00 280.59 C1146.00,340.76 1142.54,379.88 1133.88,417.86 C1121.57,471.78 1097.32,516.15 1065.52,542.93 C1032.41,570.81 993.01,585.91 945.31,589.00 C929.05,590.05 928.24,590.05 912.92,588.95 ZM 568.74 516.90 C529.83,512.58 504.56,495.51 498.42,469.40 C492.60,444.68 506.39,419.70 536.98,399.53 C566.64,379.96 595.82,369.74 686.02,347.30 L 728.90 336.63 L 727.20 333.72 C723.30,327.03 709.66,317.87 696.49,313.11 C681.94,307.84 672.82,306.55 650.50,306.56 C628.91,306.58 621.29,307.56 600.30,313.00 C563.43,322.55 533.20,343.01 527.54,362.25 L 526.29 366.50 L 519.14 366.79 L 512.00 367.09 L 512.02 346.29 C512.04,323.93 512.98,316.82 517.33,306.04 C528.74,277.79 555.76,258.41 598.86,247.55 C649.07,234.91 706.91,238.96 744.50,257.75 C757.42,264.20 767.49,271.64 777.10,281.82 C794.70,300.46 805.11,323.37 810.37,355.00 C814.01,376.86 814.43,386.77 814.46,451.50 L 814.50 515.50 L 777.26 515.76 L 740.02 516.02 L 739.76 468.36 L 739.50 420.69 L 734.07 429.59 C705.60,476.32 665.47,505.89 618.11,515.03 C605.74,517.42 581.60,518.33 568.74,516.90 ZM 639.20 455.66 C673.88,447.44 706.39,426.34 722.52,401.60 C733.10,385.36 737.48,372.46 737.11,358.62 L 737.00 354.74 L 732.75 355.41 C725.21,356.60 657.10,373.70 637.50,379.32 C590.39,392.85 567.15,405.44 559.92,421.36 C557.57,426.54 557.41,435.96 559.60,440.56 C561.77,445.15 569.07,451.67 574.78,454.12 C584.13,458.14 590.45,458.94 610.00,458.56 C625.50,458.26 630.24,457.79 639.20,455.66 ZM 68.46 514.75 C68.20,514.06 68.10,433.17 68.24,335.00 L 68.50 156.50 L 107.50 156.50 L 146.50 156.50 L 146.52 213.69 C146.53,245.14 146.81,271.14 147.14,271.47 C147.47,271.80 151.39,269.56 155.85,266.48 C171.70,255.57 192.72,247.33 211.00,244.87 C224.01,243.12 247.20,244.33 259.50,247.40 C292.88,255.73 319.88,274.91 339.17,304.00 C354.52,327.15 362.27,353.52 362.24,382.50 C362.20,430.73 339.51,472.35 299.60,497.41 C264.10,519.70 215.35,521.92 176.43,503.03 C167.09,498.49 152.31,488.56 149.13,484.68 C148.37,483.75 147.42,483.00 147.01,483.00 C146.60,483.00 146.25,489.64 146.23,497.75 C146.22,505.86 146.16,513.29 146.10,514.25 C146.01,515.88 143.46,516.00 107.47,516.00 C77.56,516.00 68.83,515.72 68.46,514.75 ZM 234.19 454.55 C269.43,447.08 294.31,416.86 294.33,381.50 C294.33,369.20 292.47,361.49 286.56,349.46 C279.14,334.35 265.38,321.32 250.35,315.17 C238.22,310.20 234.39,309.50 219.50,309.51 C206.38,309.52 204.95,309.72 196.74,312.65 C184.30,317.08 177.71,321.29 168.00,331.01 C153.54,345.47 146.89,361.42 146.81,381.80 C146.74,398.82 150.79,411.47 160.81,425.61 C176.99,448.42 207.10,460.29 234.19,454.55 ZM 390.00 336.01 L 390.00 156.00 L 428.94 156.00 C450.36,156.00 468.08,156.34 468.32,156.75 C468.56,157.16 468.48,238.05 468.13,336.50 L 467.50 515.50 L 428.75 515.76 L 390.00 516.02 L 390.00 336.01 ZM 1150.37 514.51 C1150.05,513.69 1150.01,502.10 1150.27,488.76 C1150.79,462.48 1151.39,458.73 1156.91,447.55 C1162.74,435.73 1167.81,430.89 1207.52,399.16 C1228.41,382.47 1260.51,356.71 1278.85,341.91 L 1312.19 315.00 L 1244.10 315.00 L 1176.00 315.00 L 1176.00 280.00 L 1176.00 245.00 L 1279.57 245.00 L 1383.14 245.00 L 1382.77 273.75 C1382.37,306.11 1381.78,309.41 1374.28,321.76 C1368.76,330.85 1363.44,335.85 1337.68,356.16 C1311.72,376.64 1238.48,435.12 1227.12,444.44 L 1219.74 450.50 L 1301.42 450.76 L 1383.10 451.01 L 1382.80 475.76 C1382.53,497.77 1382.29,500.93 1380.58,504.37 C1378.11,509.34 1372.23,513.57 1365.90,514.93 C1362.52,515.65 1326.83,516.00 1255.92,516.00 C1163.87,516.00 1150.87,515.82 1150.37,514.51 Z";

/** Cropped viewBox — tight to the wordmark glyphs with minimal left padding. */
const LOGO_VIEWBOX = "68 155 1305 435";

function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function createStyles(fonts: ReturnType<typeof registerProposalFonts>) {
  return StyleSheet.create({
    page: {
      fontFamily: fonts.regular,
      fontSize: 10,
      color: BRAND_COLORS.ink,
      backgroundColor: BRAND_COLORS.cream,
      paddingTop: 36,
      paddingBottom: 48,
      paddingLeft: 24,
      paddingRight: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 28,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: BRAND_COLORS.border,
    },
    brandCol: {
      alignItems: "flex-start",
    },
    /** Matches rendered logo width so the tagline can share the same left edge. */
    logoWrap: {
      width: 152,
    },
    tagline: {
      fontSize: 8.5,
      color: BRAND_COLORS.orange,
      marginTop: 5,
      /** Optical inset so "configure" sits under the "b" in the wordmark. */
      paddingLeft: 22,
    },
    metaCol: {
      alignItems: "flex-end",
    },
    metaLabel: {
      fontSize: 7.5,
      color: BRAND_COLORS.inkMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    metaValue: {
      fontSize: 10,
      fontFamily: fonts.bold,
      marginBottom: 6,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontFamily: fonts.bold,
      marginBottom: 8,
    },
    intro: {
      fontSize: 10,
      color: BRAND_COLORS.inkMuted,
      maxWidth: 320,
      lineHeight: 1.5,
    },
    preparedBlock: {
      alignItems: "flex-end",
      maxWidth: 180,
    },
    sectionLabel: {
      fontSize: 7.5,
      color: BRAND_COLORS.orange,
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    preparedName: {
      fontSize: 11,
      fontFamily: fonts.bold,
      marginBottom: 2,
    },
    preparedDetail: {
      fontSize: 9,
      color: BRAND_COLORS.inkMuted,
      marginBottom: 2,
    },
    tierCard: {
      borderWidth: 1,
      borderColor: BRAND_COLORS.border,
      borderRadius: 8,
      backgroundColor: "#fffaf4",
      padding: 16,
      flexDirection: "row",
      gap: 16,
      marginBottom: 24,
    },
    mockup: {
      width: 110,
      height: 80,
      borderWidth: 1,
      borderColor: BRAND_COLORS.border,
      borderRadius: 6,
      backgroundColor: BRAND_COLORS.creamDeep,
      padding: 8,
    },
    mockupBar: {
      height: 4,
      backgroundColor: BRAND_COLORS.orange,
      borderRadius: 2,
      marginBottom: 6,
      width: "60%",
    },
    mockupBlock: {
      height: 10,
      backgroundColor: "#ddd5c8",
      borderRadius: 2,
      marginBottom: 4,
    },
    tierContent: {
      flex: 1,
    },
    tierHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    tierName: {
      fontSize: 14,
      fontFamily: fonts.bold,
    },
    tierPrice: {
      fontSize: 16,
      fontFamily: fonts.bold,
    },
    tierBlurb: {
      fontSize: 9,
      color: BRAND_COLORS.inkMuted,
      marginBottom: 10,
      lineHeight: 1.4,
    },
    featuresGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    featureItem: {
      width: "48%",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 4,
      marginBottom: 4,
    },
    featureTick: {
      width: 10,
      height: 10,
      borderRadius: 2,
      backgroundColor: BRAND_COLORS.orange,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 1,
    },
    featureText: {
      fontSize: 9,
      color: BRAND_COLORS.ink,
      flex: 1,
      lineHeight: 1.35,
    },
    addonRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 9,
      borderBottomWidth: 1,
      borderBottomColor: BRAND_COLORS.border,
      gap: 10,
    },
    checkboxCol: {
      width: 14,
      flexShrink: 0,
    },
    checkbox: {
      width: 14,
      height: 14,
      borderWidth: 1.5,
      borderColor: "#c9bfb2",
      borderRadius: 3,
      backgroundColor: "#fffaf4",
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      width: 14,
      height: 14,
      borderRadius: 3,
      backgroundColor: BRAND_COLORS.orange,
      borderWidth: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    addonBody: {
      flex: 1,
    },
    addonLabel: {
      fontSize: 10.5,
      fontFamily: fonts.bold,
      marginBottom: 2,
    },
    addonBlurb: {
      fontSize: 8.5,
      color: BRAND_COLORS.inkMuted,
      lineHeight: 1.4,
    },
    addonPrice: {
      width: 118,
      flexShrink: 0,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    summaryCard: {
      borderWidth: 1,
      borderColor: BRAND_COLORS.border,
      borderRadius: 8,
      backgroundColor: "#fffaf4",
      flexDirection: "row",
      paddingVertical: 16,
      paddingHorizontal: 12,
      marginTop: 8,
      marginBottom: 8,
    },
    summaryCol: {
      flex: 1,
      alignItems: "center",
    },
    summaryLabel: {
      fontSize: 7.5,
      color: BRAND_COLORS.inkMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 5,
      textAlign: "center",
    },
    summaryValue: {
      fontSize: 11,
      fontFamily: fonts.bold,
      textAlign: "center",
    },
    summaryTotal: {
      fontSize: 13,
      fontFamily: fonts.bold,
      color: BRAND_COLORS.orange,
      textAlign: "center",
    },
    summaryOp: {
      fontSize: 14,
      color: BRAND_COLORS.inkMuted,
      alignSelf: "center",
      paddingHorizontal: 4,
    },
    disclaimer: {
      fontSize: 8,
      color: BRAND_COLORS.inkMuted,
      lineHeight: 1.45,
      marginBottom: 20,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: BRAND_COLORS.border,
      paddingTop: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerText: {
      fontSize: 8,
      color: BRAND_COLORS.inkMuted,
    },
    footerTagline: {
      fontSize: 8,
      color: BRAND_COLORS.orange,
    },
  });
}

const LOGO_WIDTH = 152;

function ProposalLogo() {
  return (
    <Svg viewBox={LOGO_VIEWBOX} width={LOGO_WIDTH} height={33}>
      <Path d={LOGO_PATH} fill={BRAND_COLORS.orange} />
    </Svg>
  );
}

function TickIcon({ color = "#fff" }: { color?: string }) {
  return (
    <Svg viewBox="0 0 12 12" width={7} height={7}>
      <Path
        d="M2 6.2 L4.8 9 L10 3"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FeatureTick() {
  return (
    <View style={styles.featureTick}>
      <TickIcon />
    </View>
  );
}

const fonts = registerProposalFonts();
const styles = createStyles(fonts);

function Checkbox({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <View style={styles.checkboxChecked}>
        <TickIcon />
      </View>
    );
  }
  return <View style={styles.checkbox} />;
}

function AddonPriceCell({
  addon,
  tierId,
  selectedAddons,
}: {
  addon: Addon;
  tierId: TierId;
  selectedAddons: string[];
}) {
  const included = isIncluded(addon, tierId);
  const active = included || selectedAddons.includes(addon.id);

  if (included && active) {
    return (
      <View style={styles.addonPrice}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: fonts.regular,
            color: BRAND_COLORS.inkMuted,
            textAlign: "right",
            width: "100%",
          }}
        >
          Included
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.addonPrice}>
      <PdfMoney
        amount={addon.delta[0]}
        prefix={active ? "+ " : ""}
        suffix={addon.unit === "mo" ? " /mo" : ""}
        size={11}
        bold={active}
        color={active ? BRAND_COLORS.ink : BRAND_COLORS.inkMuted}
        align="right"
        fullWidth
      />
    </View>
  );
}

export function ProposalDocument({
  tierId,
  selectedAddons,
  proposalId,
  clientName,
  clientEmail,
  proposalDate = new Date(),
}: ProposalInput) {
  const tier = getTierById(tierId);
  const breakdown = computeBreakdown(tier, selectedAddons);
  const validUntil = addDays(proposalDate, 30);

  return (
    <Document title={`Blayz Proposal ${proposalId}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandCol}>
            <View style={styles.logoWrap}>
              <ProposalLogo />
              <Text style={styles.tagline}>{BRAND.tagline}</Text>
            </View>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Proposal</Text>
            <Text style={styles.metaValue}>#{proposalId}</Text>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{formatLongDate(proposalDate)}</Text>
            <Text style={styles.metaLabel}>Valid until</Text>
            <Text style={styles.metaValue}>{formatLongDate(validUntil)}</Text>
          </View>
        </View>

        {/* Title + prepared for */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Website Build Proposal</Text>
            <Text style={styles.intro}>
              Thank you for configuring your website with blayz. Below is a
              summary of your selected build and investment.
            </Text>
          </View>
          {(clientName || clientEmail) && (
            <View style={styles.preparedBlock}>
              <Text style={styles.sectionLabel}>Prepared for</Text>
              {clientName ? (
                <Text style={styles.preparedName}>{clientName}</Text>
              ) : null}
              {clientEmail ? (
                <Text style={styles.preparedDetail}>{clientEmail}</Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Your selection */}
        <Text style={styles.sectionLabel}>Your selection</Text>
        <View style={styles.tierCard}>
          <View style={styles.mockup}>
            <View style={styles.mockupBar} />
            <View style={styles.mockupBlock} />
            <View style={[styles.mockupBlock, { width: "80%" }]} />
            <View style={[styles.mockupBlock, { width: "65%" }]} />
          </View>
          <View style={styles.tierContent}>
            <View style={styles.tierHeader}>
              <Text style={styles.tierName}>{tier.name}</Text>
              <PdfMoney amount={tier.base[0]} size={18} bold />
            </View>
            <Text style={styles.tierBlurb}>{tier.blurb}</Text>
            <View style={styles.featuresGrid}>
              {tier.features.map((feat) => (
                <View key={feat} style={styles.featureItem}>
                  <FeatureTick />
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Add-ons */}
        <Text style={styles.sectionLabel}>Add-ons</Text>
        {ADDONS.map((addon) => {
          const included = isIncluded(addon, tier.id);
          const checked = included || selectedAddons.includes(addon.id);

          return (
            <View key={addon.id} style={styles.addonRow} wrap={false}>
              <View style={styles.checkboxCol}>
                <Checkbox checked={checked} />
              </View>
              <View style={styles.addonBody}>
                <Text style={styles.addonLabel}>{addon.label}</Text>
                <Text style={styles.addonBlurb}>{addon.blurb}</Text>
              </View>
              <AddonPriceCell
                addon={addon}
                tierId={tier.id}
                selectedAddons={selectedAddons}
              />
            </View>
          );
        })}

        {/* Investment summary */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
          Investment summary
        </Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Base package</Text>
            <PdfMoney amount={breakdown.baseOnce} size={13} bold align="center" />
          </View>
          <Text style={styles.summaryOp}>+</Text>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>One-time add-ons</Text>
            <PdfMoney amount={breakdown.addonsOnce} size={13} bold align="center" />
          </View>
          <Text style={styles.summaryOp}>=</Text>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>One-time total</Text>
            <PdfMoney
              amount={breakdown.totalOnce}
              size={15}
              bold
              align="center"
              color={BRAND_COLORS.orange}
            />
          </View>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Recurring services</Text>
            <PdfMoney
              amount={breakdown.recurringMonthly}
              suffix=" / month"
              size={13}
              bold
              align="center"
            />
          </View>
        </View>
        <Text style={styles.disclaimer}>
          VAT is not included unless otherwise stated. This proposal is an
          estimate and subject to changes based on final requirements.
        </Text>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {BRAND.site} | {BRAND.email} | {BRAND.phone}
          </Text>
          <Text style={styles.footerTagline}>{BRAND.tagline}</Text>
        </View>
      </Page>
    </Document>
  );
}
