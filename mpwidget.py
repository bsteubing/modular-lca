#!/usr/bin/env python
# -*- coding: utf-8 -*-

from PyQt4 import QtCore, QtGui, QtWebKit
# from PySide import QtCore, QtGui, QtWebKit
from browser_utils import HelperMethods, MyQTableWidgetItem, BrowserStandardTasks
from jinja2 import Template
import json
import pickle
import xlsxwriter
import os
from mpcreator import MetaProcessCreator
from linkedmetaprocess import LinkedMetaProcessSystem
import numpy as np
import operator
from matplotlib.backends.backend_qt4agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.backends.backend_qt4agg import NavigationToolbar2QT as NavigationToolbar
import matplotlib.pyplot as plt


class MPWidget(QtGui.QWidget):
    signal_activity_key = QtCore.pyqtSignal(MyQTableWidgetItem)
    signal_status_bar_message = QtCore.pyqtSignal(str)
    def __init__(self, parent=None):
        super(MPWidget, self).__init__(parent)
        self.MPC = MetaProcessCreator()
        self.lmp = LinkedMetaProcessSystem()
        self.helper = HelperMethods()
        self.lcaData = BrowserStandardTasks()
        self.setupUserInterface()
        self.set_up_PP_analyzer()

    def setupUserInterface(self):
        # MP Widgets
        self.MPdataWidget = QtGui.QWidget()
        # Webview
        self.webview = QtWebKit.QWebView()
        # D3
        self.template = Template(open(os.path.join(os.getcwd(), "HTML", "tree_vertical.html")).read())
        self.current_d3_layout = "dagre"
        # LABELS
        label_process_subsystem = QtGui.QLabel("Meta-Process")
        label_MP_database = QtGui.QLabel("MP Database")
        # BUTTONS
        # Meta-Processs
        button_new_process_subsystem = QtGui.QPushButton("New")
        button_add_MP_to_Database = QtGui.QPushButton("Add to DB")
        button_delete_MP_from_Database = QtGui.QPushButton("Delete")
        button_graph = QtGui.QPushButton("Graph")
        button_toggle_layout = QtGui.QPushButton("Toggle")
        # MP Database
        button_load_MP_database = QtGui.QPushButton("Load DB")
        button_saveAs_MP_database = QtGui.QPushButton("Save DB")
        button_addDB = QtGui.QPushButton("Add DB")
        button_closeDB = QtGui.QPushButton("Close DB")
        button_pp_graph = QtGui.QPushButton("PP-Graph")

        # buttons TOOLBAR
        self.toolbar_MP = QtGui.QToolBar('Toolbar MP')
        self.toolbar_MP.addWidget(button_new_process_subsystem)
        self.toolbar_MP.addWidget(button_add_MP_to_Database)
        self.toolbar_MP.addWidget(button_delete_MP_from_Database)
        self.toolbar_MP.addWidget(button_graph)
        self.toolbar_MP.addWidget(button_toggle_layout)
        self.toolbar_MP.addSeparator()
        self.toolbar_MP.addWidget(button_load_MP_database)
        self.toolbar_MP.addWidget(button_saveAs_MP_database)
        self.toolbar_MP.addWidget(button_addDB)
        self.toolbar_MP.addWidget(button_closeDB)
        self.toolbar_MP.addWidget(button_pp_graph)

        # LAYOUTS for buttons
        # Meta-Process
        self.HL_MP_buttons = QtGui.QHBoxLayout()
        # self.HL_MP_buttons.addWidget(label_process_subsystem)
        # self.HL_MP_buttons.addWidget(button_new_process_subsystem)
        # self.HL_MP_buttons.addWidget(button_add_MP_to_Database)
        # self.HL_MP_buttons.addWidget(button_delete_MP_from_Database)
        # self.HL_MP_buttons.addWidget(button_toggle_layout)
        # self.HL_MP_buttons.addWidget(button_graph)
        # MP Database
        self.HL_MP_Database_buttons = QtGui.QHBoxLayout()
        # self.HL_MP_Database_buttons.addWidget(label_MP_database)
        # self.HL_MP_Database_buttons.addWidget(button_load_MP_database)
        # self.HL_MP_Database_buttons.addWidget(button_saveAs_MP_database)
        # self.HL_MP_Database_buttons.addWidget(button_addDB)
        # self.HL_MP_Database_buttons.addWidget(button_closeDB)
        # self.HL_MP_Database_buttons.addWidget(button_pp_graph)

        # CONNECTIONS
        button_new_process_subsystem.clicked.connect(self.newProcessSubsystem)
        button_load_MP_database.clicked.connect(self.loadMPDatabase)
        button_saveAs_MP_database.clicked.connect(self.saveAsMPDatabase)
        button_add_MP_to_Database.clicked.connect(self.addMPtoDatabase)
        button_toggle_layout.clicked.connect(self.toggleLayout)
        button_graph.clicked.connect(self.showGraph)
        button_delete_MP_from_Database.clicked.connect(self.deleteMPfromDatabase)
        button_addDB.clicked.connect(self.addMPDatabase)
        button_closeDB.clicked.connect(self.closeMPDatabase)
        button_pp_graph.clicked.connect(self.pp_graph)
        # TREEWIDGETS
        self.tree_widget_cuts = QtGui.QTreeWidget()
        # TABLES
        self.table_MP_chain = QtGui.QTableWidget()
        self.table_MP_outputs = QtGui.QTableWidget()
        self.table_MP_database = QtGui.QTableWidget()
        # Checkboxes
        self.checkbox_output_based_scaling = QtGui.QCheckBox('Output based scaling (default)')
        self.checkbox_output_based_scaling.setChecked(True)
        # MP data
        VL_MP_data = QtGui.QVBoxLayout()
        self.MPdataWidget.setLayout(VL_MP_data)
        self.line_edit_MP_name = QtGui.QLineEdit(self.MPC.mp.name)
        VL_MP_data.addWidget(self.line_edit_MP_name)
        VL_MP_data.addWidget(self.checkbox_output_based_scaling)
        VL_MP_data.addWidget(QtGui.QLabel("Outputs"))
        VL_MP_data.addWidget(self.table_MP_outputs)
        VL_MP_data.addWidget(QtGui.QLabel("Chain"))
        VL_MP_data.addWidget(self.table_MP_chain)
        VL_MP_data.addWidget(QtGui.QLabel("Cuts"))
        VL_MP_data.addWidget(self.tree_widget_cuts)
        # CONNECTIONS
        self.line_edit_MP_name.returnPressed.connect(self.set_mp_name)
        self.table_MP_chain.itemDoubleClicked.connect(self.setNewCurrentActivity)
        self.tree_widget_cuts.itemChanged.connect(self.set_cut_custom_data)
        self.table_MP_outputs.itemChanged.connect(self.set_output_custom_data)
        self.table_MP_outputs.currentItemChanged.connect(self.save_text_before_edit)
        self.table_MP_database.itemDoubleClicked.connect(self.loadMP)
        self.checkbox_output_based_scaling.stateChanged.connect(self.set_output_based_scaling)
        # CONTEXT MENUS
        # Outputs
        self.table_MP_outputs.setContextMenuPolicy(QtCore.Qt.ActionsContextMenu)
        self.action_addOutput = QtGui.QAction("Duplicate", None)
        self.action_addOutput.triggered.connect(self.addOutput)
        self.table_MP_outputs.addAction(self.action_addOutput)
        self.action_removeOutput = QtGui.QAction("Remove", None)
        self.action_removeOutput.triggered.connect(self.removeOutput)
        self.table_MP_outputs.addAction(self.action_removeOutput)
        # Chain
        self.table_MP_chain.setContextMenuPolicy(QtCore.Qt.ActionsContextMenu)
        self.action_addCut = QtGui.QAction("Cut", None)
        self.action_addCut.triggered.connect(self.addCut)
        self.table_MP_chain.addAction(self.action_addCut)
        self.action_remove_chain_item = QtGui.QAction("Remove from MP", None)
        self.action_remove_chain_item.triggered.connect(self.removeChainItem)
        self.table_MP_chain.addAction(self.action_remove_chain_item)
        # Cuts treeview
        self.tree_widget_cuts.setContextMenuPolicy(QtCore.Qt.ActionsContextMenu)
        self.action_removeCut = QtGui.QAction("Remove cut", None)
        self.action_removeCut.triggered.connect(self.deleteCut)
        self.tree_widget_cuts.addAction(self.action_removeCut)
        # MP Database
        self.table_MP_database.setContextMenuPolicy(QtCore.Qt.ActionsContextMenu)
        self.action_delete_selected = QtGui.QAction("Delete selected", None)
        self.action_delete_selected.triggered.connect(self.delete_selected_MP)
        self.table_MP_database.addAction(self.action_delete_selected)

    def set_up_PP_analyzer(self):
        self.PP_analyzer = QtGui.QWidget()
        # Labels
        label_functional_unit = QtGui.QLabel("Functional Unit:")
        self.label_FU_unit = QtGui.QLabel("unit")
        self.label_LCIA_method = QtGui.QLabel("LCIA Method: (see LCIA tab)")
        # Line edits
        self.line_edit_FU = QtGui.QLineEdit("1.0")
        # Buttons
        self.button_PP_lca = QtGui.QPushButton("LCA")
        self.button_PP_pathways = QtGui.QPushButton("Pathways")
        self.button_PP_lca_pathways = QtGui.QPushButton("LCA-Pathways")
        # Dropdown
        self.combo_functional_unit = QtGui.QComboBox(self)
        self.combo_functional_unit.setMinimumWidth(200)
        # Tables
        self.table_PP_comparison = QtGui.QTableWidget()

        # MATPLOTLIB FIGURE
        self.matplotlib_figure = QtGui.QWidget()
        self.figure = plt.figure()
        self.canvas = FigureCanvas(self.figure)
        # self.toolbar = NavigationToolbar(self.canvas, self)  # it takes the Canvas widget and a parent
        self.toolbar = NavigationToolbar(self.canvas, self.matplotlib_figure)
        # set the layout
        plt_layout = QtGui.QVBoxLayout()
        plt_layout.addWidget(self.toolbar)
        plt_layout.addWidget(self.canvas)
        self.matplotlib_figure.setLayout(plt_layout)

        # HL
        self.HL_functional_unit = QtGui.QHBoxLayout()
        self.HL_functional_unit.setAlignment(QtCore.Qt.AlignLeft)
        self.HL_functional_unit.addWidget(label_functional_unit)
        self.HL_functional_unit.addWidget(self.line_edit_FU)
        self.HL_functional_unit.addWidget(self.label_FU_unit)

        self.HL_PP_analysis = QtGui.QHBoxLayout()
        self.HL_PP_analysis.setAlignment(QtCore.Qt.AlignLeft)
        self.HL_PP_analysis.addWidget(self.button_PP_lca)
        self.HL_PP_analysis.addWidget(self.button_PP_pathways)
        self.HL_PP_analysis.addWidget(self.button_PP_lca_pathways)
        self.HL_PP_analysis.addWidget(self.label_LCIA_method)

        # VL
        self.VL_PP_analyzer = QtGui.QVBoxLayout()
        self.VL_PP_analyzer.addLayout(self.HL_functional_unit)
        self.VL_PP_analyzer.addLayout(self.HL_PP_analysis)
        self.VL_PP_analyzer.addWidget(self.table_PP_comparison)
        self.VL_PP_analyzer.addWidget(self.matplotlib_figure)
        self.PP_analyzer.setLayout(self.VL_PP_analyzer)
        # Connections
        self.button_PP_pathways.clicked.connect(self.show_all_pathways)
        self.button_PP_lca.clicked.connect(self.get_meta_process_lcas)
        self.button_PP_lca_pathways.clicked.connect(self.compare_pathway_lcas)
        self.combo_functional_unit.currentIndexChanged.connect(self.update_FU_unit)
        self.table_PP_comparison.itemSelectionChanged.connect(self.show_path_graph)

    # MP DATABASE

    def loadMPDatabase(self, mode="load new"):
        file_types = "Pickle (*.pickle);;All (*.*)"
        filename = QtGui.QFileDialog.getOpenFileName(self, 'Open File', '.\MetaProcessDatabases', file_types)
        if filename:
            print "Load mode: " + str(mode)
            if mode == "load new" or not mode:  # if called via connect: mode = False
                self.lmp.load_from_file(filename)
            elif mode == "append":
                self.lmp.load_from_file(filename, append=True)
            self.signal_status_bar_message.emit("Loaded MP Database successfully.")
            self.updateTableMPDatabase()

    def addMPDatabase(self):
        self.loadMPDatabase(mode="append")

    def closeMPDatabase(self):
        msg = "If you close the database, all unsaved Data will be lost. Continue?"
        reply = QtGui.QMessageBox.question(self, 'Message',
                    msg, QtGui.QMessageBox.Yes, QtGui.QMessageBox.No)
        if reply == QtGui.QMessageBox.Yes:
            self.lmp = LinkedMetaProcessSystem()
            self.updateTableMPDatabase()
            self.signal_status_bar_message.emit("Closed MP Database.")

    def saveMPDatabase(self, filename=None):
        self.lmp.save_to_file(filename)
        self.signal_status_bar_message.emit("MP Database saved.")

    def saveAsMPDatabase(self):
        if self.lmp.mp_list:
            file_types = "Pickle (*.pickle);;All (*.*)"
            filename = QtGui.QFileDialog.getSaveFileName(self, 'Save File', '.\MetaProcessDatabases', file_types)
            if filename:
                self.saveMPDatabase(filename)
                self.signal_status_bar_message.emit("MP Database saved.")

    def updateTableMPDatabase(self):
        data = []
        for mp_data in self.lmp.raw_data:
            numbers = [len(mp_data['outputs']), len(set(mp_data['chain'])), len(set(mp_data['cuts']))]
            data.append({
                'name': mp_data['name'],
                'out/chain/cuts': "/".join(map(str, numbers)),
                'outputs': ", ".join([o[1] for o in mp_data['outputs']]),
                'chain': "//".join([self.MPC.getActivityData(o)['name'] for o in mp_data['chain']]),
                'cuts': ", ".join([o[2] for o in mp_data['cuts']]),
            })
        keys = ['name', 'out/chain/cuts', 'outputs', 'cuts', 'chain']
        self.table_MP_database = self.helper.update_table(self.table_MP_database, data, keys)

    # MP <--> MP DATABASE

    def loadMP(self):
        item = self.table_MP_database.currentItem()
        for mp in self.lmp.raw_data:
            if mp['name'] == str(item.text()):
                self.MPC.load_mp(mp)
        self.signal_status_bar_message.emit("Loaded MP: " + str(item.text()))
        self.showGraph()

    def addMPtoDatabase(self):
        if self.MPC.mp_data['chain']:
            add = False
            mp_name = self.MPC.mp_data['name']
            if mp_name not in self.lmp.processes:
                add = True
            else:
                mgs = "Do you want to overwrite the existing MP?"
                reply = QtGui.QMessageBox.question(self, 'Message',
                            mgs, QtGui.QMessageBox.Yes, QtGui.QMessageBox.No)
                if reply == QtGui.QMessageBox.Yes:
                    add = True
                    self.lmp.remove_mp([mp_name])  # first remove mp that is to be replaced
            if add:
                self.lmp.add_mp([self.MPC.mp_data])
                self.update_widget_MP_data()
                self.signal_status_bar_message.emit("Added MP to working database (not saved).")

# TODO: remove; doesn't seem necessary anymore
    def deleteMPfromDatabase(self):
        if self.MPC.mp_data['chain']:
            self.lmp.remove_mp([self.MPC.mp_data['name']])
            self.updateTableMPDatabase()
            self.signal_status_bar_message.emit(str("Deleted (from working database): " + self.MPC.mp_data['name']))

    def delete_selected_MP(self):
        processes_to_delete = [str(item.text()) for item in self.table_MP_database.selectedItems()]
        self.lmp.remove_mp(processes_to_delete)
        print "Deleted from working MP database:", processes_to_delete
        self.updateTableMPDatabase()
        self.signal_status_bar_message.emit("Deleted selected items.")

    # MP

    def newProcessSubsystem(self):
        self.MPC.newMetaProcess()
        self.showGraph()

    def addOutput(self):
        item = self.table_MP_outputs.currentItem()
        print "\nDuplicating output: " + str(item.activity_or_database_key) + " " + item.text()
        self.MPC.add_output(item.activity_or_database_key)
        self.showGraph()

    def removeOutput(self):
        item = self.table_MP_outputs.currentItem()
        print "\nRemoving output: " + str(item.activity_or_database_key) + " " + item.text()
        key = item.activity_or_database_key
        row = self.table_MP_outputs.currentRow()
        name = str(self.table_MP_outputs.item(row, 0).text())
        amount = str(self.table_MP_outputs.item(row, 1).text())
        self.MPC.remove_output(key, name, float(amount))
        self.showGraph()

    def addToChain(self, item):
        self.MPC.add_to_chain(item.activity_or_database_key)
        self.showGraph()

    def removeChainItem(self):
        print "\nCONTEXT MENU: "+self.action_remove_chain_item.text()
        item = self.table_MP_chain.currentItem()
        self.MPC.delete_from_chain(item.activity_or_database_key)
        self.showGraph()

    def addCut(self):
        print "\nCONTEXT MENU: "+self.action_addCut.text()
        item = self.table_MP_chain.currentItem()
        self.MPC.add_cut(item.activity_or_database_key)
        self.showGraph()

    def deleteCut(self):
        print "\nCONTEXT MENU: "+self.action_removeCut.text()
        item = self.tree_widget_cuts.itemFromIndex(self.tree_widget_cuts.currentIndex())
        if item.activity_or_database_key:
            self.MPC.delete_cut(item.activity_or_database_key)
            self.showGraph()

    def set_mp_name(self):
        name = str(self.line_edit_MP_name.text())  # otherwise QString
        self.MPC.set_mp_name(name)
        self.showGraph()

    def set_output_based_scaling(self):
        self.MPC.set_output_based_scaling(self.checkbox_output_based_scaling.isChecked())
        self.showGraph()

    def set_output_custom_data(self):

        item = self.table_MP_outputs.currentItem()
        text = str(item.text())
        key = item.activity_or_database_key
        # need this information to distinguish between outputs that have the same key
        # (makes the code a bit ugly, but outputs have no unique id)
        row = self.table_MP_outputs.currentRow()
        name = str(self.table_MP_outputs.item(row, 0).text())
        amount = str(self.table_MP_outputs.item(row, 1).text())
        if item.column() == 0:  # name
            print "\nChanging output NAME to: " + text
            self.MPC.set_output_name(key, text, self.text_before_edit, float(amount))
        elif item.column() == 1 and self.helper.is_float(text):  # quantity
            print "\nChanging output QUANTITY to: " + text
            self.MPC.set_output_quantity(key, float(text), name, float(self.text_before_edit))
        else:  # ignore!
            print "\nYou don't want to do this, do you?"
        self.showGraph()

    def save_text_before_edit(self):
        self.text_before_edit = str(self.table_MP_outputs.currentItem().text())

    def set_cut_custom_data(self):
        item = self.tree_widget_cuts.itemFromIndex(self.tree_widget_cuts.currentIndex())
        self.MPC.set_cut_name(item.activity_or_database_key, str(item.text(0)))
        self.showGraph()

    # UPDATING TABLES etc: MP

    def update_widget_MP_data(self):
        self.line_edit_MP_name.setText(self.MPC.mp.name)
        self.updateTableMPDatabase()
        self.update_MP_table_widget_outputs()
        self.update_MP_table_widget_chain()
        self.update_MP_tree_widget_cuts()
        self.update_checkbox_output_based_scaling()

    def update_MP_table_widget_outputs(self):
        keys = ['custom name', 'quantity', 'unit', 'product', 'name', 'location', 'database']
        edit_keys = ['custom name', 'quantity']
        data = []
        if self.MPC.mp.outputs:
            for i, output in enumerate(self.MPC.mp.outputs):
                output_data = self.MPC.getActivityData(output[0])
                try:
                    output_name = output[1]
                except IndexError:
                    output_name = "Output " + str(i)
                try:
                    output_quantity = output[2]
                except IndexError:
                    output_quantity = "1"
                output_data.update({'custom name': output_name, 'quantity': output_quantity})
                data.append(output_data)
        self.table_MP_outputs = self.helper.update_table(self.table_MP_outputs, data, keys, edit_keys)

    def update_MP_table_widget_chain(self):
        keys = ['product', 'name', 'location', 'unit', 'database']
        data = [self.MPC.getActivityData(c) for c in self.MPC.mp.chain]
        self.table_MP_chain = self.helper.update_table(self.table_MP_chain, data, keys)

    def update_MP_tree_widget_cuts(self):
        def formatActivityData(ad):
            ad_list = []
            for key in keys:
                ad_list.append(ad.get(key, 'NA'))
            return ad_list
        self.tree_widget_cuts.blockSignals(True)  # no itemChanged signals during updating
        self.tree_widget_cuts.clear()
        keys = ['product', 'name', 'location', 'amount', 'unit', 'database']
        self.tree_widget_cuts.setHeaderLabels(keys)
        root = MyTreeWidgetItem(self.tree_widget_cuts, ['Cuts'])

        for i, cut in enumerate(self.MPC.mp.cuts):
            try:
                cut_name = cut[2]
            except IndexError:
                cut_name = "Set input name"
            newNode = MyTreeWidgetItem(root, [cut_name])
            newNode.activity_or_database_key = cut[0]
            newNode.setFlags(newNode.flags() | QtCore.Qt.ItemIsEditable)
            # make row with activity data
            ad = formatActivityData(self.MPC.getActivityData(cut[0]))
            # TODO: fix bug for multi-output activities (e.g. sawing): cut too high (activity scaled by several outputs)!
            ad[3] = cut[3]  # set amount to that of internal_scaled_edge_with_cuts
            cutFromNode = MyTreeWidgetItem(newNode, [str(item) for item in ad])
            cutFromNode.activity_or_database_key = cut[0]
            ad = formatActivityData(self.MPC.getActivityData(cut[1]))
            ad[3] = ''  # we are only interested in the cutFromNode amount
            cutToNode = MyTreeWidgetItem(newNode, [str(item) for item in ad])

        # display and signals
        self.tree_widget_cuts.expandAll()
        for i in range(len(keys)):
            self.tree_widget_cuts.resizeColumnToContents(i)
        self.tree_widget_cuts.blockSignals(False)  # itemChanged signals again after updating
        self.tree_widget_cuts.setEditTriggers(QtGui.QTableWidget.AllEditTriggers)

    def update_checkbox_output_based_scaling(self):
        self.checkbox_output_based_scaling.setChecked(self.MPC.mp_data['output_based_scaling'])

    # LMP alternatives and LCA

    def get_meta_process_lcas(self, process_list=None, method=None):
        """
        returns dict where: keys = MP name, value = LCA score
        """
        # method = (u'IPCC 2007', u'climate change', u'GWP 100a')  # TODO
        method = self.lcaData.LCIA_METHOD
        if not method:
            self.signal_status_bar_message.emit('Need to define an LCIA method first.')
        else:
            map_process_lcascore = self.lmp.lca_processes(method, process_names=process_list)
            data = []
            for name, score in map_process_lcascore.items():
                data.append({
                    'meta-process': name,
                    'LCA score': score
                })
            self.update_PP_comparison_table(data=data, keys=['meta-process', 'LCA score'])

    def show_all_pathways(self):
        functional_unit = str(self.combo_functional_unit.currentText())
        data = [{'path': p} for p in self.lmp.all_pathways(functional_unit)]
        keys = ['path']
        self.table_PP_comparison = self.helper.update_table(self.table_PP_comparison, data, keys)

# TODO: check if demand propagates all the way through mp.lca
    # TODO: get method from combobox
    def compare_pathway_lcas(self):
        method = (u'IPCC 2007', u'climate change', u'GWP 100a')
        demand = {str(self.combo_functional_unit.currentText()): 1.0}
        self.path_data = self.lmp.lca_alternatives(method, demand)
        self.path_data = sorted(self.path_data, key=lambda k: k['LCA score'], reverse=True)  # sort by highest score
        self.update_PP_comparison_table(data=self.path_data, keys=['LCA score', 'path'])
        self.plot_figure()

    def plot_figure(self):
        ''' plot matplotlib figure for LCA alternatives '''
        # get matplotlib figure data
        data = np.zeros((len(self.lmp.map_products_number), len(self.path_data)), dtype=np.float)
        for i, l in enumerate(self.path_data):
            for process, value in l['process contribution'].items():
                # creates matrix where rows are products and columns hold process/product specific impact scores
                data[self.lmp.map_products_number[self.lmp.get_output_names([process])[0]], i] = value  # caution, problem for multi-output processes

        # data for labels, colors, ...
        number_products = len(data)
        number_lcas = len(self.path_data)
        ind = np.arange(number_lcas)
        ind_label = np.arange(number_lcas)
        product_label = [self.lmp.map_number_products[i] for i in np.arange(number_products)]
        bottom = np.vstack((np.zeros((data.shape[1],), dtype=data.dtype), np.cumsum(data, axis=0)[:-1]))
        colormap = plt.cm.autumn
        colors = [colormap(c) for c in np.linspace(0, 1, number_products)]

        # plotting
        self.figure.clf()
        ax = self.figure.add_subplot(111)
        plt.rcParams.update({'font.size': 10})
        for dat, col, bot, label in zip(data, colors, bottom, product_label):
            ax.bar(ind, dat, color=col, bottom=bot, label=label, edgecolor="none")
        plt.xticks(ind+0.5, ind_label+1)
        impact_unit = bw2.methods[self.path_data[0]['LCIA method']]['unit']
        demand_product = "'"+self.path_data[0]['demand'].keys()[0]+"'"
        plt.xlabel('alternatives to produce '+demand_product), plt.ylabel(impact_unit)
        # reverse the order of the legend
        handles, labels = ax.get_legend_handles_labels()
        ax.legend(handles[::-1], labels[::-1], loc='upper right', prop={'size':10})
        # plt.legend(loc='upper right', prop={'size':10})
        # plt.legend(bbox_to_anchor=(1.05, 1), loc=2, borderaxespad=0.)
        self.canvas.draw()

    def update_FU_unit(self):
        for mp in self.lmp.mp_list:
            for o in mp.outputs:
                if str(self.combo_functional_unit.currentText()) == o[1]:
                    unit = self.MPC.getActivityData(o[0])['unit']
                    self.label_FU_unit.setText(QtCore.QString(unit))  # TODO: check if indentation solved the error message; before at level of first "for"

    def update_PP_comparison_table(self, data, keys):
        self.table_PP_comparison = self.helper.update_table(self.table_PP_comparison, data, keys)

    # VISUALIZATION

    def showGraph(self):
        self.update_widget_MP_data()
        geo = self.webview.geometry()
        # data needed depends on D3 layout
        if self.current_d3_layout == "tree":
            template_data = {
                'height': geo.height(),
                'width': geo.width(),
                'data': json.dumps(self.MPC.getTreeData(), indent=1)
            }
            self.set_webview(template_data, self.current_d3_layout)
        elif self.current_d3_layout == "graph":
            template_data = {
                'height': geo.height(),
                'width': geo.width(),
                'data': json.dumps(self.MPC.getGraphData(), indent=1)
            }
            self.set_webview(template_data, self.current_d3_layout)
            print json.dumps(self.MPC.getGraphData(), indent=1)
        elif self.current_d3_layout == "dagre":
            template_data = self.MPC.get_dagre_data()
            self.set_webview(template_data, self.current_d3_layout)

    def set_webview(self, template_data, template_name):
        templates = {
            "tree": os.path.join(os.getcwd(), "HTML", "tree_vertical.html"),
            "graph": os.path.join(os.getcwd(), "HTML", "force_directed_graph.html"),
            "dagre": os.path.join(os.getcwd(), "HTML", "dagre_graph.html"),
            "pp_graph": os.path.join(os.getcwd(), "HTML", "force_directed_graph.html"),
            "dagre_path": os.path.join(os.getcwd(), "HTML", "dagre_graph_path.html"),
        }
        filename = os.path.join(os.getcwd(), "HTML", "temp.html")
        url = QtCore.QUrl("file:///"+"/".join(filename.split("\\")))
        self.template = Template(open(templates[template_name]).read())
        with open(filename, "w") as f:
            f.write(self.template.render(**template_data))
        self.webview.load(url)

    def toggleLayout(self):
        if self.current_d3_layout == "tree":
            self.current_d3_layout = "graph"
        elif self.current_d3_layout == "graph":
            self.current_d3_layout = "dagre"
        else:
            self.current_d3_layout = "tree"
        print "Visualization as: " + self.current_d3_layout
        self.showGraph()

    def pp_graph(self):
        self.save_pp_matrix()
        self.combo_functional_unit.clear()
        for product in self.lmp.products:
            self.combo_functional_unit.addItem(product)

        if self.current_d3_layout == "graph" or self.current_d3_layout == "dagre":
            template_data = {
                'height': self.webview.geometry().height(),
                'width': self.webview.geometry().width(),
                'data': json.dumps(self.get_pp_graph(), indent=1)
            }
            print "\nPP-GRAPH DATA:"
            print self.get_pp_graph()

        elif self.current_d3_layout == "tree":
            template_data = {
                'height': self.webview.geometry().height(),
                'width': self.webview.geometry().width(),
                'data': json.dumps(self.get_pp_tree(), indent=1)
            }
        self.set_webview(template_data, self.current_d3_layout)

    def get_pp_graph(self):
        graph_data = []
        for mp in self.lmp.mp_list:
            for input in mp.cuts:
                graph_data.append({
                    'source': input[2],
                    'target': mp.name,
                    'type': 'suit',
                    'class': 'chain',  # this gets overwritten with "activity" in dagre_graph.html
                    'product_in': input[3],
                    # 'lca_score': "0.555",
                })
            for output in mp.outputs:
                graph_data.append({
                    'source': mp.name,
                    'target': output[1],
                    'type': 'suit',
                    'class': 'output',
                    'product_out': output[2],
                    # 'lca_score': "0.415",
                })
        return graph_data

    def get_pp_tree(self):
        def get_nodes(node):
            d = {}
            if node == root:
                d['name'] = node
            else:
                d['name'] = node
            parents = get_parents(node)
            if parents:
                d['children'] = [get_nodes(parent) for parent in parents]
            return d

        def get_parents(node):
            return [x[0] for x in parents_children if x[1] == node]
        tree_data = []
        graph_data = self.get_pp_graph()  # source / target dicts
        parents_children = [(d['source'], d['target']) for d in graph_data]  # not using amount yet
        sources, targets = zip(*parents_children)
        head_nodes = list(set([t for t in targets if not t in sources]))

        root = "MP database outputs"
        for head in head_nodes:
            parents_children.append((head, root))

        tree_data.append(get_nodes(root))
        return tree_data

    def show_path_graph(self):
        item = self.table_PP_comparison.currentItem()
        if item.path:
            template_data = {
                'height': self.webview.geometry().height(),
                'width': self.webview.geometry().width(),
                'data': json.dumps(self.get_pp_path_graph(item.path), indent=1)
            }
            self.set_webview(template_data, "dagre_path")

    def get_pp_path_graph(self, path):
        print "PATH:", path
        path_data = [pd for pd in self.path_data if path == pd['path']][0]
        print path_data

        graph_data = []
        for mp in self.lmp.mp_list:
            part_of_path = True if mp.name in path else False
            if part_of_path:
                lca_score = path_data['process contribution'][mp.name]
                lca_score_rel = path_data['relative process contribution'][mp.name]
                lca_result = "{0:.3g} ({1:.3g}%)".format(lca_score, lca_score_rel*100)

            for input in mp.cuts:
                graph_data.append({
                    'source': input[2],
                    'target': mp.name,
                    'type': 'suit',
                    'class': 'chain',  # this gets overwritten with "activity" in dagre_graph.html
                    'product_in': input[3],
                    'part_of_path': part_of_path,
                    # 'lca_score': '' if not part_of_path else lca_result,
                })
            for output in mp.outputs:
                graph_data.append({
                    'source': mp.name,
                    'target': output[1],
                    'type': 'suit',
                    'class': 'output',
                    'product_out': output[2],
                    'part_of_path': part_of_path,
                    'lca_score': '' if not part_of_path else lca_result,
                })
        return graph_data

    # OTHER METHODS

    def setNewCurrentActivity(self):
        self.signal_activity_key.emit(self.table_MP_chain.currentItem())

    def save_pp_matrix(self):
        matrix, processes, products = self.lmp.get_pp_matrix()  # self.get_process_products_as_array()

        print "\nPP-MATRIX:"
        print "PROCESSES:"
        print processes
        print "PRODUCTS"
        print products
        print "MATRIX"
        print matrix

        # export pp-matrix data to pickle file
        # order processes/products by number in dictionary
        data = {
            'processes': [x[0] for x in sorted(processes.items(), key=operator.itemgetter(1))],
            'products': [x[0] for x in sorted(products.items(), key=operator.itemgetter(1))],
            'matrix': matrix,
        }
        filename = os.path.join(os.getcwd(), "MetaProcessDatabases", "pp-matrix.pickle")
        with open(filename, 'w') as output:
            pickle.dump(data, output)
        # Excel export
        try:
            self.export_pp_matrix_to_excel(processes, products, matrix)
        except:
            print "An error has occured saving the PP-Matrix as .xlsx file."
        # filename = os.path.join(os.getcwd(), "MetaProcessDatabases", "pp-matrix.json")
        # with open(filename, 'w') as outfile:
        #     json.dump(data, outfile, indent=2)

    def export_pp_matrix_to_excel(self, processes, products, matrix, filename='pp-matrix.xlsx'):
        filename = os.path.join(os.getcwd(), "MetaProcessDatabases", filename)
        workbook = xlsxwriter.Workbook(filename)
        ws = workbook.add_worksheet('pp-matrix')
        # formatting
        # border
        format_border = workbook.add_format()
        format_border.set_border(1)
        format_border.set_font_size(9)
        # border + text wrap
        format_border_text_wrap = workbook.add_format()
        format_border_text_wrap.set_text_wrap()
        format_border_text_wrap.set_border(1)
        format_border_text_wrap.set_font_size(9)
        # set column width
        ws.set_column(0, 1, width=15, cell_format=None)
        ws.set_column(1, 50, width=9, cell_format=None)
        # write data
        for i, p in enumerate(processes):  # process names
            ws.write(0, i+1, p, format_border_text_wrap)
        for i, p in enumerate(products):  # product names
            ws.write(i+1, 0, p, format_border)
        for i, row in enumerate(range(matrix.shape[0])):  # matrix
            ws.write_row(i+1, 1, matrix[i, :], format_border)
        workbook.close()

    def export_as_JSON(self):
        outdata = []
        for mp_data in self.lmp.raw_data:
            outdata.append(self.MPC.getHumanReadibleMP(mp_data))
        file_types = "Python (*.py);;JSON (*.json);;All (*.*)"
        filename = QtGui.QFileDialog.getSaveFileName(self, 'Save File', '.\MetaProcessDatabases', file_types)
        with open(filename, 'w') as outfile:
            json.dump(outdata, outfile, indent=4, sort_keys=True)