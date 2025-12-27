
export const DEFAULT_INPUT = [
  { ch: 'A', weight: 5 },
  { ch: 'B', weight: 9 },
  { ch: 'C', weight: 12 },
  { ch: 'D', weight: 13 },
  { ch: 'E', weight: 16 },
  { ch: 'F', weight: 45 },
];

export const CPP_CODE = `#include <iostream>
using namespace std;
#define MAX 100

typedef struct{
	char ch;
	int parent;
	int lchild;
	int rchild;
	int weight;
} HTNode;

typedef struct{
	HTNode ht[2*MAX];
	int n;
	int m;
}HuffmanTree;

// 选择两个权值最小的结点
void Select(HuffmanTree& HT, int i, int& s1, int& s2) {
    int min1 = 999, min2 = 999;
    for (int j = 1; j <= i - 1; j++) {
        if (HT.ht[j].parent == 0) {
            if (HT.ht[j].weight < min1) {
                min2 = min1; s2 = s1;
                min1 = HT.ht[j].weight; s1 = j;
            } else if (HT.ht[j].weight < min2) {
                min2 = HT.ht[j].weight; s2 = j;
            }
        }
    }
}

// 构造哈夫曼树
void CreateHuffmanTree(HuffmanTree& HT) {
    HT.m = 2 * HT.n - 1;
    for (int i = 1; i <= HT.m; i++) {
        HT.ht[i].parent = 0;
        HT.ht[i].lchild = 0;
        HT.ht[i].rchild = 0;
    }
    // 构建过程
    for (int i = HT.n + 1; i <= HT.m; i++) {
        int s1 = 0, s2 = 0;
        Select(HT, i, s1, s2);
        HT.ht[s1].parent = i;
        HT.ht[s2].parent = i;
        HT.ht[i].lchild = s1;
        HT.ht[i].rchild = s2;
        HT.ht[i].weight = HT.ht[s1].weight + HT.ht[s2].weight;
    }
}

// 输出哈夫曼编码
void HuffmanCoding(HuffmanTree& HT) {
    for (int i = 1; i <= HT.n; i++) {
        int c = i, f = HT.ht[i].parent;
        string code = "";
        while (f != 0) {
            if (HT.ht[f].lchild == c) code = '0' + code;
            else code = '1' + code;
            c = f; f = HT.ht[f].parent;
        }
        cout << HT.ht[i].ch << "：" << code << endl;
    }
}

int main(){
	HuffmanTree HT;
	// 初始化HT.n, HT.ht[i].weight等...
	CreateHuffmanTree(HT);
	HuffmanCoding(HT);
	return 0;
}`;

export const CODE_SECTION_RANGES = {
  SELECT: [19, 32] as [number, number],
  CREATE: [34, 52] as [number, number],
  CODING: [54, 66] as [number, number],
};
