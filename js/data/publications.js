/**
 * Publications data configuration
 * 
 * This file contains all publication entries for the publications page.
 * To add new publications:
 * 1. Add a new entry with a unique key (use significant words from title)
 * 2. Add the tag, title, description, venue, paper URL, and abstract
 * 
 * Format:
 *   KEY: {
 *     tag: "TAG TEXT",
 *     title: "Publication Title",
 *     description: "Short description",
 *     venue: "Venue Name, Year",
 *     url: "https://...",
 *     abstract: "Full abstract text"
 *   }
 */

var PUBLICATIONS_DATA = {
  'mining-multispectral': {
    tag: 'Q1 · IF: 11.4',
    title: "Multi-modal deep learning approaches to semantic segmentation of mining footprints with multispectral satellite imagery",
    description: 'Semantic segmentation of global mining footprints using multispectral satellite imagery across 37 locations worldwide.',
    venue: 'Remote Sensing of Environment, Volume 318, 2025',
    url: 'https://doi.org/10.1016/j.rse.2024.114584',
    abstract: 'Existing remote sensing applications in mining are often of limited scope, typically mapping multiple mining land covers for a single mine or only mapping mining extents or a single feature (e.g., tailings dam) for multiple mines across a region. Many of these works have a narrow focus on specific mine land covers rather than encompassing the variety of mining and non-mining land use in a mine site. This study presents a pioneering effort in performing deep learning-based semantic segmentation of 37 mining locations worldwide, representing a range of commodities from gold to coal, using multispectral satellite imagery, to automate mapping of mining and non-mining land covers. Due to the absence of a dedicated training dataset, we crafted a customized multispectral dataset for training and testing deep learning models, leveraging and refining existing datasets in terms of boundaries, shapes, and class labels. We trained and tested multimodal semantic segmentation models, particularly based on U-Net, DeepLabV3+, Feature Pyramid Network (FPN), SegFormer, and IBM-NASA foundational geospatial model (Prithvi) architecture, with a focus on evaluating different model configurations, input band combinations, and the effectiveness of transfer learning. In terms of multimodality, we utilized various image bands, including Red, Green, Blue, and Near Infra-Red (NIR) and Normalized Difference Vegetation Index (NDVI), to determine which combination of inputs yields the most accurate segmentation. Results indicated that among different configurations, FPN with DenseNet-121 backbone, pre-trained on ImageNet, and trained using both RGB and NIR bands, performs the best. We concluded the study with a comprehensive assessment of the model\'s performance based on climate classification categories and diverse mining commodities.'
  },
  'sea-vl': {
    tag: 'MAJOR CONTRIBUTOR · ACL 2025',
    title: 'Crowdsource, Crawl, or Generate? Creating SEA-VL, a Multicultural Vision-Language Dataset for Southeast Asia',
    description: 'A multicultural VL benchmark for SEA.',
    venue: 'ACL 2025',
    url: 'https://aclanthology.org/2025.acl-long.916/',
    abstract: "Despite Southeast Asia's (SEA) extraordinary linguistic and cultural diversity, the region remains significantly underrepresented in vision-language (VL) research, resulting in AI models that inadequately capture SEA cultural nuances. To fill this gap, we present SEA-VL, an open-source initiative dedicated to developing culturally relevant high-quality datasets for SEA languages. By involving contributors from SEA countries, SEA-VL ensures better cultural relevance and diversity, fostering greater inclusivity of underrepresented languages and cultural depictions in VL research. Our methodology employed three approaches: community-driven crowdsourcing with SEA contributors, automated image crawling, and synthetic image generation. We evaluated each method's effectiveness in capturing cultural relevance. We found that image crawling achieves approximately ~85% cultural relevance while being more cost- and time-efficient than crowdsourcing, whereas synthetic image generation failed to accurately reflect SEA cultural nuances and contexts. Collectively, we gathered 1.28 million SEA culturally relevant images, more than 50 times larger than other existing datasets. This work bridges the representation gap in SEA, establishes a foundation for developing culturally aware AI systems for this region, and provides a replicable framework for addressing representation gaps in other underrepresented regions."
  },
  'flood-procanet': {
    tag: 'FIRST AUTHOR · IEEE Q1',
    title: 'Progressive Cross-Attention Network for Flood Segmentation Using Multispectral Satellite Imagery',
    description: 'Using multispectral satellite imagery for flood segmentation.',
    venue: 'IEEE Geoscience and Remote Sensing Letters, 2024',
    url: 'https://ieeexplore.ieee.org/document/10750225',
    abstract: 'In recent years, the integration of deep learning techniques with remote sensing technology has revolutionized the way natural hazards, such as floods, are monitored and managed. However, existing methods for flood segmentation using remote sensing data often overlook the utility of correlative features among multispectral satellite information. In this study, we introduce a progressive cross-attention network (ProCANet), a deep learning model that progressively applies both self- and cross-attention mechanisms to multispectral features, generating optimal feature combinations for flood segmentation. The proposed model was compared with state-of-the-art approaches using the Sen1Floods11 dataset and our bespoke flood data generated for the Citarum River basin, Indonesia. Our model demonstrated superior performance with the highest intersection over union (IoU) score of 0.815. Our results in this study, coupled with the ablation assessment comparing scenarios with and without attention across various modalities, open a promising path for enhancing the accuracy of flood analysis using remote sensing technology.'
  },
  'retention-ponds': {
    tag: 'Q2 · IF: 2.3',
    title: 'Enhancing urban resilience through integrated flood policy and planning: a mixed-methods evaluation of retention ponds for flood mitigation in South Bandung',
    description: 'Mixed-methods evaluation of retention ponds for urban flood mitigation.',
    venue: 'AQUA - Water Infrastructure, Ecosystems and Society, Volume 74(2), 2025',
    url: 'https://iwaponline.com/aqua/article/74/2/267/106789/Enhancing-urban-resilience-through-integrated',
    abstract: 'This study focuses on South Bandung, an area where flooding is a recurring problem, causing significant damage to infrastructure and displacing local residents. The region\'s vulnerability stems from its geographical location, surrounded by rivers and low-lying areas, coupled with challenges such as the heavily polluted and sedimented Citarum River. This research examines the role of retention ponds in Andir and Cieunteung as a strategic response to these flood management challenges. The study employs a mixed-methods approach, integrating remote sensing and Geographic Information System (GIS) analysis with deep learning-based semantic segmentation techniques to evaluate the hydraulic performance of the retention ponds. Normalized difference water index and semantic segmentation approaches using multispectral images (red, green, and blue and near-infrared) from the PlanetScope constellation satellite are utilized to assess water bodies and flooding patterns, while field observations and stakeholder interviews provide qualitative insights into the operational effectiveness of these infrastructures. While this study highlights that the construction of retention ponds can help mitigate flood events, it also emphasizes the importance of an integrated approach combining urban planning, community engagement, and multi-scale infrastructure development in addressing the complex challenges of flood resilience and urban sustainability.'
  },
  'commonlid': {
    tag: 'ACL 2026',
    title: 'CommonLID: Re-evaluating State-of-the-Art Language Identification Performance on Web Data',
    description: 'State-of-the-art language identification performance evaluation.',
    venue: 'ACL 2026 (Accepted)',
    url: 'https://arxiv.org/abs/2601.18026',
    abstract: 'Language identification (LID) is a fundamental step in curating multilingual corpora. However, LID models still perform poorly for many languages, especially on the noisy and heterogeneous web data often used to train multilingual language models. In this paper, we introduce CommonLID, a community-driven, human-annotated LID benchmark for the web domain, covering 109 languages. Many of the included languages have been previously under-served, making CommonLID a key resource for developing more representative high-quality text corpora. We show CommonLID\'s value by using it, alongside five other common evaluation sets, to test eight popular LID models. We analyse our results to situate our contribution and to provide an overview of the state of the art. In particular, we highlight that existing evaluations overestimate LID accuracy for many languages in the web domain. We make CommonLID and the code used to create it available under an open, permissive license.'
  },
  'anthropogenic': {
    tag: 'UNDER REVIEW',
    title: 'Anthropogenic Regional Adaptation in Multimodal Vision-Language Model',
    description: 'Vision-language model adaptation for cultural relevance in SEA.',
    venue: 'Under Review',
    url: 'https://arxiv.org/abs/2604.11490',
    abstract: "While the field of vision-language (VL) has achieved remarkable success in integrating visual and textual information across multiple languages and domains, there is still no dedicated framework for assessing human-centric alignment in vision-language systems. We offer two contributions to address this gap. First, we introduce Anthropogenic Regional Adaptation: a novel paradigm that aims to optimize model relevance to specific regional contexts while ensuring the retention of global generalization capabilities. Second, we present a simple, but effective adaptation method named Geographical-generalization-made-easy (GG-EZ), which utilizes regional data filtering and model merging. Through comprehensive experiments on 3 VL architectures: large vision-language models, text-to-image diffusion models, and vision-language embedding models, and a case study in Southeast Asia (SEA) regional adaptation, we demonstrate the importance of Anthropogenic Regional Adaptation and the effectiveness of GG-EZ, showing 5-15% gains in cultural relevance metrics across SEA while maintaining over 98% of global performance and even occasionally surpassing it. Our findings establish Anthropogenic Regional Alignment as a foundational paradigm towards applicability of multimodal vision-language models in diverse regions and demonstrate a simple-yet-effective baseline method that optimizes regional value alignment while preserving global generalization."
  },
  'plastic-bag-ban': {
    tag: 'FIRST AUTHOR',
    title: 'The Effect of Plastic Bag Ban Policy Towards Waste Complaints in Jakarta Through JAKI and Qlue',
    description: 'Analysis through JAKI and Qlue platforms.',
    venue: 'ICISS 2021',
    url: 'https://ieeexplore.ieee.org/document/9533236/',
    abstract: 'Plastic bag ban policy has been implemented in Jakarta since July 1st, 2020. However, it is still unclear the impact of this policy on Jakarta to reduce waste. The public complaint can be used as a proxy to see how the public responds to the waste reports distributed in Jakarta. This research aims to look at the plastic bag ban policy\'s significance towards waste complaints through two applications that citizens used to report, JAKI and Qlue. In this study, non-parametric hypothesis testing was performed since the data are not normally distributed. The result shows that North Jakarta did not show any significant differences in the waste reports after the plastic bag ban policy. On the other hand, the rest of the districts show a considerable difference.'
  }
};