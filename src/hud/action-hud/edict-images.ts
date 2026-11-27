import type { EdictId } from "../../logic/edicts";

const imageFiles: Partial<Record<EdictId, string>> = {
  bribe: "8/83/T1edict-Bribe.gif",
  arrest: "a/aa/T1edict-Arrest.gif",
  capture: "7/79/T1edict-Capture.gif",
  eliminate: "3/3a/T1edict-Eliminate.gif",
  "praise-us": "5/53/T1edict-PraiseUS.gif",
  "praise-ussr": "7/79/T1edict-PraiseUSSR.gif",
  "industry-ad-campaign": "9/98/T1edict-IndustrialAdCampaign.gif",
  "air-pollution-standards": "6/65/T1edict-AirPollutionStandards.gif",
  "tourism-ad-campaign": "2/20/T1edict-TourismAdCampaign.gif",
  headliner: "f/fa/T1edict-TheHeadliner.gif",
  "spring-break-package": "1/1e/T1edict-SpringBreakPackage.gif",
  "mardi-gras": "5/5a/T1edict-MardiGras.gif",
  amnesty: "5/56/T1edict-Amnesty.gif",
  inquisition: "8/8e/T1edict-Inquisition.gif",
  "book-bbq": "0/0d/T1edict-BookBBQ.gif",
  "military-modernization": "3/3f/T1edict-MilitaryModernization.gif",
  "open-jails": "c/c1/T1edict-OpenThePrisons.gif",
  "papal-visit": "4/48/T1edict-PapalVisit.gif",
  prohibition: "3/35/T1edict-Prohibition.gif",
  "contraception-ban": "a/af/T1edict-ContraceptionBan.gif",
  "anti-litter-ordinance": "5/5b/T1edict-AntiLitterOrdinance.gif",
  "sensitivity-training": "9/9a/T1edict-SensitivityTraining.gif",
  "food-for-the-people": "9/9a/T1edict-FoodForThePeople.gif",
};

export function edictImage(id: EdictId): string | undefined {
  const file = imageFiles[id];
  return file ? `https://static.wikia.nocookie.net/tropico/images/${file}/revision/latest` : undefined;
}
