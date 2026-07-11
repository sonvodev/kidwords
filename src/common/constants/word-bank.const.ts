import { sampleArray } from "@/utils/utils";

/**
 * Vocabulary bank for a 3-year-old. The "Nạp từ vựng" form auto-fills this
 * list based on the chosen quantity; the user can then edit it by hand.
 * Replace with a backend-driven list once the API is available.
 */
export const KID_WORDS: string[] = [
	"ba",
	"mẹ",
	"bà",
	"ông",
	"bé",
	"anh",
	"chị",
	"cá",
	"gà",
	"chó",
	"mèo",
	"bò",
	"voi",
	"gấu",
	"hổ",
	"thỏ",
	"chim",
	"vịt",
	"heo",
	"ngựa",
	"cây",
	"hoa",
	"lá",
	"quả",
	"mưa",
	"nắng",
	"gió",
	"trăng",
	"sao",
	"mây",
	"bánh",
	"sữa",
	"cơm",
	"phở",
	"nước",
	"kẹo",
	"bóng",
	"xe",
	"tàu",
	"thuyền",
	"mũ",
	"áo",
	"dép",
	"tay",
	"chân",
	"mắt",
	"mũi",
	"tai",
	"miệng",
	"tóc",
];

/** Pick `count` distinct kid words to seed the form. */
export const getKidWords = (count: number): string[] =>
	sampleArray(KID_WORDS, count);
