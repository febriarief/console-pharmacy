import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
    {
        name: 'Dashboard',
        icon: 'fa-regular fa-chart-tree-map',
        url: '/dashboard'
    },


    {
        name: 'Master',
        title: true,
        attributes: {
            permission: 'Title.Master.View'
        }
    },

    {
        name: 'Master Barang',
        url: '/master-item',
        icon: 'fa-regular fa-cubes',
        attributes: {
			permission: 'Menu.MasterItem.View'
		},
        children: [
            {
                name: 'Satuan',
                icon: 'fa-regular fa-scale-unbalanced-flip',
                url: '/master-item/unit',
                attributes: {
                    permission: 'Menu.Unit.View'
                }
            },
            {
                name: 'Barang',
                icon: 'fa-regular fa-box',
                url: '/master-item/item',
                attributes: {
                    permission: 'Menu.Item.View'
                }
            },
            {
                name: 'Stok',
                icon: 'fa-regular fa-layer-group',
                url: '/master-item/stock',
                attributes: {
                    permission: 'Menu.Stock.View'
                }
            },
            {
                name: 'Kartu Stok',
                icon: 'fa-regular fa-list-ol',
                url: '/master-item/stock-card',
                attributes: {
                    permission: 'Menu.StockCard.View'
                }
            }
        ]
    },

    {
        name: 'Pembelian & Penjualan',
        title: true,
        attributes: {
            permission: 'Title.SaleAndPurchase.View'
        }
    },

    {
        name: 'Pembelian',
        url: '/purchase',
        icon: 'fa-sharp fa-regular fa-bag-shopping',
        attributes: {
			permission: 'Menu.Purchase.View'
		},
        children: [
            {
                name: 'Supplier',
                icon: 'fa-regular fa-truck-field-un',
                url: '/purchase/supplier',
                attributes: {
                    permission: 'Menu.Supplier.View'
                },
            },
            {
                name: 'Permintaan Pembelian',
                icon: 'fa-sharp fa-regular fa-file-signature',
                url: '/purchase/purchase-request',
                attributes: {
                    permission: 'Menu.PurchaseRequest.View'
                },
            },
            {
                name: 'Order Pembelian',
                icon: 'fa-regular fa-file-invoice',
                url: '/purchase/purchase-order',
                attributes: {
                    permission: 'Menu.PurchaseOrder.View'
                },
            },
            {
                name: 'Penerimaan Barang',
                icon: 'fa-sharp fa-regular fa-truck-ramp-box',
                url: '/purchase/goods-received',
                attributes: {
                    permission: 'Menu.GoodsReceived.View'
                },
            }
        ]
    },

    {
        name: 'Penjualan',
        url: '/sales',
        icon: 'fa-regular fa-cart-shopping',
        attributes: {
			permission: 'Menu.Sales.View'
		},
        children: [
            {
                name: 'Kasir',
                icon: 'fa-regular fa-cash-register',
                url: '/sales/cashier',
                attributes: {
                    permission: 'Menu.Cashier.View'
                }
            },
        ]
    },

    {
        name: 'Pengaturan Sistem',
        title: true,
        attributes: {
            permission: 'Title.System.View'
        }
    },

    {
        name: 'Sistem',
        url: '/system',
        icon: 'fa-sharp fa-regular fa-gears',
        attributes: {
			permission: 'Menu.System.View'
		}, 
        children: [
            {
                name: 'Hak Akses',
                icon: 'fa-regular fa-shield-keyhole',
                url: '/system/permission',
                attributes: {
                    permission: 'Menu.Permission.View'
                }
            },
            {
                name: 'Role',
                icon: 'fa-regular fa-user-shield',
                url: '/system/role',
                attributes: {
                    permission: 'Menu.Role.View'
                }
            },
            {
                name: 'Pengguna',
                icon: 'fa-regular fa-users',
                url: '/system/user',
                attributes: {
                    permission: 'Menu.User.View'
                }
            }
        ]
    },
];
