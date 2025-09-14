import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import axios, { AxiosInstance } from "axios"
import * as dotenv from "dotenv"

dotenv.config()

class RedditAdsAPIClient {
	private axiosInstance: AxiosInstance
	private accessToken: string
	private apiBaseUrl: string

	constructor(accessToken: string, apiBaseUrl: string) {
		this.accessToken = accessToken
		this.apiBaseUrl = apiBaseUrl
		this.axiosInstance = axios.create({
			baseURL: apiBaseUrl,
			headers: {
				"Authorization": `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		})
	}

	async getAdAccounts(businessId?: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-ad-accounts', {
			params: { businessId },
		})
		return response.data
	}

	async getFundingInstruments(adAccountId: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-funding-instruments', {
			params: { adAccountId },
		})
		return response.data
	}

	async getCampaigns(adAccountId: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-campaigns', {
			params: { adAccountId },
		})
		return response.data
	}

	async getAdGroups(adAccountId: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-ad-groups', {
			params: { adAccountId },
		})
		return response.data
	}

	async getProfiles(adAccountId: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-profiles', {
			params: { adAccountId },
		})
		return response.data
	}

	async getPosts(profileId: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-posts', {
			params: { profileId },
		})
		return response.data
	}

	async getPost(postId: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-post', {
			params: { postId },
		})
		return response.data
	}

	async createCampaign(data: any) {
		const response = await this.axiosInstance.post('/api/reddit/ads/create-campaign', data)
		return response.data
	}

	async createAdGroup(data: any) {
		const response = await this.axiosInstance.post('/api/reddit/ads/create-ad-group', data)
		return response.data
	}

	async createPost(data: any) {
		const response = await this.axiosInstance.post('/api/reddit/ads/create-post', data)
		return response.data
	}

	async createAd(data: any) {
		const response = await this.axiosInstance.post('/api/reddit/ads/create-ad', data)
		return response.data
	}

	async getAds(adAccountId: string) {
		const response = await this.axiosInstance.get('/api/reddit/ads/get-ads', {
			params: { adAccountId },
		})
		return response.data
	}

	async generateImage(prompt: string, style?: string) {
		const response = await this.axiosInstance.post('/api/reddit/ads/generate-image', {
			prompt,
			style
		})
		return response.data
	}
}

export const configSchema = z.object({
	REDDABLE_API_KEY: z.string().describe("Long-term API key for Reddable MCP access"),
})

export default function createServer({
	config,
}: {
	config: z.infer<typeof configSchema>
}) {
	const server = new McpServer({
		name: "Reddit Ads MCP",
		version: "1.0.0",
	})

	const redditClient = new RedditAdsAPIClient(config.REDDABLE_API_KEY, "http://localhost:3000")

	server.registerTool(
		"getAdAccounts",
		{
			title: "Get Ad Accounts",
			description: "Get all available Reddit ad accounts for a business",
			inputSchema: {
				businessId: z.string().optional().describe("Reddit Business ID (optional if REDDIT_BUSINESS_ID env var is set)"),
			},
		},
		async ({ businessId }) => {
			try {
				const accounts = await redditClient.getAdAccounts(businessId)
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(accounts, null, 2),
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching ad accounts: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"getFundingInstruments",
		{
			title: "Get Funding Instruments",
			description: "Get all payment methods/funding instruments for an ad account",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID"),
			},
		},
		async ({ adAccountId }) => {
			try {
				const instruments = await redditClient.getFundingInstruments(adAccountId)
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(instruments, null, 2),
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching funding instruments: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"getCampaigns",
		{
			title: "Get Campaigns",
			description: "Get all campaigns for an ad account",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID"),
			},
		},
		async ({ adAccountId }) => {
			try {
				const campaigns = await redditClient.getCampaigns(adAccountId)
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(campaigns, null, 2),
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching campaigns: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"getAdGroups",
		{
			title: "Get Ad Groups",
			description: "Get all ad groups for an ad account",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID"),
			},
		},
		async ({ adAccountId }) => {
			try {
				const adGroups = await redditClient.getAdGroups(adAccountId)
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(adGroups, null, 2),
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching ad groups: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"getProfiles",
		{
			title: "Get Profiles",
			description: "Get all Reddit profiles/accounts available for an ad account",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID"),
			},
		},
		async ({ adAccountId }) => {
			try {
				const profiles = await redditClient.getProfiles(adAccountId)
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(profiles, null, 2),
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching profiles: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"getPosts",
		{
			title: "Get Posts",
			description: "Get all posts for a specific Reddit profile",
			inputSchema: {
				profileId: z.string().describe("Reddit profile ID"),
			},
		},
		async ({ profileId }) => {
			try {
				const posts = await redditClient.getPosts(profileId)
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(posts, null, 2),
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching posts: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"getPost",
		{
			title: "Get Post",
			description: "Get details for a specific Reddit post",
			inputSchema: {
				postId: z.string().describe("Reddit post ID"),
			},
		},
		async ({ postId }) => {
			try {
				const post = await redditClient.getPost(postId)
				return {
					content: [
						{
							type: "text",
							text: post
								? JSON.stringify(post, null, 2)
								: `Post with ID ${postId} not found`,
						},
					],
					isError: !post,
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error fetching post: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"createCampaign",
		{
			title: "Create Campaign",
			description: "Create a new Reddit advertising campaign",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID"),
				name: z.string().min(3).max(200).describe("Campaign name (3-200 characters)"),
				objective: z.enum([
					"APP_INSTALLS",
					"CATALOG_SALES", 
					"CLICKS",
					"CONVERSIONS",
					"IMPRESSIONS",
					"LEAD_GENERATION",
					"VIDEO_VIEWABLE_IMPRESSIONS"
				]).describe("Campaign objective type"),
				fundingInstrumentId: z.string().describe("Funding instrument ID for payment"),
				configuredStatus: z.enum(["ACTIVE", "ARCHIVED", "DELETED", "PAUSED"]).default("ACTIVE").describe("Campaign status"),
				spendCap: z.number().optional().describe("Campaign lifetime spend cap in microcurrency"),
				goalValue: z.number().optional().describe("Campaign level goal value in micros (requires CBO)"),
				goalType: z.enum(["LIFETIME_SPEND", "DAILY_SPEND"]).optional().describe("Campaign goal type (requires CBO)"),
				appId: z.string().optional().describe("App ID for app installs campaigns (Apple App Store or Google Play)"),
				ageRestriction: z.enum(["ABOVE_18", "ABOVE_21", "NO_AGE_RESTRICTION"]).default("NO_AGE_RESTRICTION").describe("Age restriction for campaign")
			},
		},
		async ({ 
			adAccountId, 
			name, 
			objective, 
			fundingInstrumentId,
			configuredStatus = "ACTIVE",
			spendCap,
			goalValue,
			goalType,
			appId,
			ageRestriction = "NO_AGE_RESTRICTION"
		}) => {
			try {
				const campaign = await redditClient.createCampaign({
					adAccountId,
					name,
					objective,
					fundingInstrumentId,
					configuredStatus,
					spendCap,
					goalValue,
					goalType,
					appId,
					ageRestriction
				})
				return {
					content: [
						{
							type: "text",
							text: `Successfully created campaign: ${JSON.stringify(campaign, null, 2)}`
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error creating campaign: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"createAdGroup",
		{
			title: "Create Ad Group",
			description: "Create a new Reddit ad group with targeting and bidding options",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID"),
				campaignId: z.string().describe("Campaign ID this ad group belongs to"),
				name: z.string().describe("Ad group name"),
				configuredStatus: z.enum(["ACTIVE", "ARCHIVED", "DELETED", "PAUSED"]).default("ACTIVE").describe("Ad group status"),
				bidType: z.enum(["CPC", "CPM", "CPV", "CPV6"]).optional().describe("Bidding strategy type"),
				bidValue: z.number().min(0).optional().describe("Bid amount in microcurrency per event"),
				bidStrategy: z.enum(["BIDLESS", "MANUAL_BIDDING", "MAXIMIZE_VOLUME", "TARGET_CPX"]).optional().describe("Bid strategy"),
				goalValue: z.number().min(0).optional().describe("Goal value in microcurrency"),
				goalType: z.enum(["DAILY_SPEND", "LIFETIME_SPEND"]).optional().describe("Type of goal"),
				startTime: z.string().optional().describe("ISO 8601 timestamp when ad group starts (e.g., 2025-09-18T22:27:10Z)"),
				endTime: z.string().optional().describe("ISO 8601 timestamp when ad group ends"),
				optimizationGoal: z.enum([
					"PAGE_VISIT", "VIEW_CONTENT", "SEARCH", "ADD_TO_CART", "ADD_TO_WISHLIST", 
					"PURCHASE", "LEAD", "SIGN_UP", "CLICKS", "MOBILE_CONVERSION_INSTALL",
					"MOBILE_CONVERSION_SIGN_UP", "MOBILE_CONVERSION_ADD_PAYMENT_INFO",
					"MOBILE_CONVERSION_ADD_TO_CART", "MOBILE_CONVERSION_PURCHASE",
					"MOBILE_CONVERSION_COMPLETED_TUTORIAL", "MOBILE_CONVERSION_LEVEL_ACHIEVED",
					"MOBILE_CONVERSION_SPEND_CREDITS", "MOBILE_CONVERSION_REINSTALL",
					"MOBILE_CONVERSION_UNLOCK_ACHIEVEMENT", "MOBILE_CONVERSION_START_TRIAL",
					"MOBILE_CONVERSION_SUBSCRIBE", "MOBILE_CONVERSION_ONBOARD_STARTED",
					"MOBILE_CONVERSION_FIRST_TIME_PURCHASE"
				]).optional().describe("Optimization goal for conversions"),
				targeting: z.object({
					communities: z.array(z.string()).optional(),
					geolocations: z.array(z.string()).optional(),
					age_targeting: z.object({
						min_age: z.number().min(13).max(65).optional(),
						max_age: z.number().min(13).max(65).optional()
					}).optional()
				}).optional().describe("Targeting options"),
				appId: z.string().optional().describe("App ID for app install campaigns")
			},
		},
		async ({ 
			adAccountId, 
			campaignId, 
			name,
			configuredStatus = "ACTIVE",
			bidType,
			bidValue,
			bidStrategy,
			goalValue,
			goalType,
			startTime,
			endTime,
			optimizationGoal,
			targeting,
			appId
		}) => {
			try {
				const adGroup = await redditClient.createAdGroup({
					adAccountId,
					campaignId,
					name,
					configuredStatus,
					bidType,
					bidValue,
					bidStrategy,
					goalValue,
					goalType,
					startTime,
					endTime,
					optimizationGoal,
					targeting,
					appId
				})
				return {
					content: [
						{
							type: "text",
							text: `Successfully created ad group: ${JSON.stringify(adGroup, null, 2)}`
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error creating ad group: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"createPost",
		{
			title: "Create Post",
			description: "Create a new Reddit post for advertising",
			inputSchema: {
				profileId: z.string().describe("Reddit profile ID (format: t2_xxxxx)"),
				type: z.enum(["CAROUSEL", "IMAGE", "TEXT", "VIDEO"]).describe("Post type"),
				headline: z.string().describe("Post title/headline"),
				allowComments: z.boolean().default(true).describe("Enable comments on the post"),
				body: z.string().max(40000).optional().describe("Text content for text posts (max 40,000 characters)"),
				thumbnailUrl: z.string().url().optional().describe("Thumbnail image URL (required for video posts)"),
				content: z.array(z.object({
					call_to_action: z.string().optional().describe("Call to action text (e.g., 'Learn More')"),
					destination_url: z.string().url().optional().describe("Destination URL when clicked"),
					display_url: z.string().optional().describe("Display URL shown to users"),
					media_url: z.string().url().optional().describe("Image/video media URL")
				})).max(6).optional().describe("Post content array (max 6 items for carousel, 1 for others)"),
				isRichtext: z.boolean().optional().describe("Whether text post body is in richtext format"),
				imageDescription: z.string().optional().describe("Description for AI image generation")
			},
		},
		async ({ 
			profileId, 
			type, 
			headline,
			allowComments = true,
			body,
			thumbnailUrl,
			content,
			isRichtext,
			imageDescription
		}) => {
			try {
				const post = await redditClient.createPost({
					profileId,
					type,
					headline,
					allowComments,
					body,
					thumbnailUrl,
					content,
					isRichtext,
					imageDescription
				})
				return {
					content: [
						{
							type: "text",
							text: `Successfully created post: ${JSON.stringify(post, null, 2)}`
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error creating post: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"createAd",
		{
			title: "Create Reddit Ad",
			description: "Create a Reddit ad using the official Reddit Ads API",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID"),
				name: z.string().min(1).max(500).describe("Ad name (1-500 characters)"),
				configuredStatus: z.enum(["ACTIVE", "ARCHIVED", "DELETED", "PAUSED"]).describe("Ad status"),
				adGroupId: z.string().optional().describe("Ad group ID this ad belongs to"),
				campaignId: z.string().optional().describe("Campaign ID this ad belongs to"),
				clickUrl: z.string().max(5000).optional().describe("Destination URL when ad is clicked (max 5000 characters)"),
				postId: z.string().regex(/^t3_.*/).optional().describe("Reddit post ID to promote (format: t3_xxxxx)"),
				campaignObjectiveType: z.enum([
					"APP_INSTALLS",
					"CATALOG_SALES",
					"CLICKS", 
					"CONVERSIONS",
					"IMPRESSIONS",
					"LEAD_GENERATION",
					"VIDEO_VIEWABLE_IMPRESSIONS"
				]).optional().describe("Campaign objective type"),
				profileId: z.string().optional().describe("Profile ID for catalog sales campaigns"),
				profileUsername: z.string().optional().describe("Profile username for catalog sales campaigns"),
				clickUrlQueryParams: z.array(z.object({
					name: z.string().describe("Query parameter name"),
					value: z.string().describe("Query parameter value")
				})).max(14).optional().describe("UTM parameters for click URL (max 14 items)"),
				eventTrackers: z.array(z.object({
					type: z.string().describe("Event type (e.g., CLICK)"),
					url: z.string().url().describe("Tracking URL")
				})).optional().describe("Event tracking pixels from approved providers"),
				shoppingCreative: z.object({
					allow_comments: z.boolean().optional(),
					call_to_action: z.string().optional(),
					destination_url: z.string().url().optional(),
					headline: z.string().optional(),
					second_line_cta: z.string().optional(),
					dpa_carousel_mode: z.string().optional()
				}).optional().describe("Shopping creative settings"),
				products: z.array(z.object({
					product_id: z.string().describe("Product ID")
				})).optional().describe("Products associated with the ad"),
				previewExpiry: z.string().optional().describe("ISO 8601 timestamp for preview URL expiry")
			},
		},
		async ({ 
			adAccountId, 
			name, 
			configuredStatus,
			adGroupId,
			campaignId,
			clickUrl, 
			postId,
			campaignObjectiveType, 
			profileId, 
			profileUsername,
			clickUrlQueryParams,
			eventTrackers,
			shoppingCreative,
			products,
			previewExpiry
		}) => {
			try {
				const ad = await redditClient.createAd({
					adAccountId,
					name,
					configuredStatus,
					adGroupId,
					campaignId,
					clickUrl,
					postId,
					campaignObjectiveType,
					profileId,
					profileUsername,
					clickUrlQueryParams,
					eventTrackers,
					shoppingCreative,
					products,
					previewExpiry
				})
				return {
					content: [
						{
							type: "text",
							text: `Successfully created ad: ${JSON.stringify(ad, null, 2)}`
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error creating ad: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"getAds",
		{
			title: "Get All Ads",
			description: "Get all ads from a Reddit ad account",
			inputSchema: {
				adAccountId: z.string().describe("Reddit ad account ID")
			},
		},
		async ({ adAccountId }) => {
			try {
				const ads = await redditClient.getAds(adAccountId)
				return {
					content: [
						{
							type: "text",
							text: `Found ${ads.length} ads:\n\n${JSON.stringify(ads, null, 2)}`
						},
					],
				}
			} catch (error) {
				return {
					content: [
						{
							type: "text",
							text: `Error getting ads: ${error}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	server.registerTool(
		"generateImage",
		{
			title: "Generate Image",
			description: "Generate an image from a text description using Google's Gemini Flash Image Preview",
			inputSchema: {
				prompt: z.string().describe("Text description of the image to generate"),
				style: z.enum(["photorealistic", "illustration", "minimalist", "artistic"]).default("photorealistic").describe("Style of the generated image"),
			},
		},
		async ({ prompt, style = "photorealistic" }) => {
			try {
				const result = await redditClient.generateImage(prompt, style)
				return {
					content: [
						{
							type: "text",
							text: `Successfully generated image with ${style} style.`,
						},
						{
							type: "text",
							text: JSON.stringify({ 
								image_url: result.image_url,
								upload_status: result.upload_status
							}, null, 2),
						},
					],
				}
			} catch (error: any) {
				return {
					content: [
						{
							type: "text",
							text: `Error generating image: ${error.response?.data?.error || error.message}`,
						},
					],
					isError: true,
				}
			}
		}
	)

	return server.server
}