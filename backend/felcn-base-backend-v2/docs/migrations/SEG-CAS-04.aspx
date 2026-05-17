<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaPrin.master" AutoEventWireup="true" CodeFile="SEG-CAS-04.aspx.cs" Inherits="Forms_SEG_CAS_04" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="animate__animated p-6">
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <ol class="flex text-primary font-semibold dark:text-white-dark">
                    <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                    <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">REGISTRO DE CASOS</a></li>
                    <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a href="javascript:;" class="p-1.5 px-3 ltr:pl-6 rtl:pr-6 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">CONSULTA OPERATIVOS</a></li>
                </ol>
            </div>
            <asp:Button ID="btnlimpiar" runat="server" Text="Limpiar Busqueda" class="btn btn-primary btn-sm" OnClick="btnlimpiar_Click" />
            <br />
            <div class="panel">
                <div class="mb-5">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Desde</div>
                        <asp:TextBox ID="txtfechaini" runat="server" placeholder="" class="form-input form-input-sm" Width="100px"></asp:TextBox>
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Hasta</div>
                        <asp:TextBox ID="txtfechafin" runat="server" placeholder="" class="form-input form-input-sm" Width="100px"></asp:TextBox>&nbsp;
                    <asp:Button ID="btnfecha" runat="server" Text="BUSCAR" class="btn btn-danger btn-sm" OnClick="btnfecha_Click" />
                    </div>
                    <br />
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Caso</div>
                        <asp:TextBox ID="txtcaso" runat="server" class="form-input ltr:rounded-l-none rtl:rounded-r-none py-1.5 text-xs" Width="150px"></asp:TextBox>&nbsp;
                    <asp:Button ID="btncaso" runat="server" Text="BUSCAR" class="btn btn-danger btn-sm" OnClick="btncaso_Click" />
                    </div>
                    <br />
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo de Droga</div>
                        <asp:DropDownList ID="cbotipodr" runat="server" AutoPostBack="True" class="form-select form-select-sm text-white-dark" OnSelectedIndexChanged="cbotipodr_SelectedIndexChanged" Width="300px"></asp:DropDownList>&nbsp;
                    <asp:Button ID="tntipodroga" runat="server" Text="BUSCAR" class="btn btn-danger btn-sm" OnClick="tntipodroga_Click" />
                    </div>
                    <br />
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Estado de la Droga</div>
                        <asp:DropDownList ID="cboestdrog" class="form-select form-select-sm text-white-dark" runat="server" Width="300px"></asp:DropDownList>&nbsp;
                    <asp:Button ID="btnestadroga" runat="server" Text="BUSCAR" class="btn btn-danger btn-sm" OnClick="btnestadroga_Click" />
                    </div>
                    <br />
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Tipo de Operativo</div>
                        <asp:DropDownList ID="cbotipoop" class="form-select form-select-sm text-white-dark" runat="server" Width="300px"></asp:DropDownList>&nbsp;
                    <asp:Button ID="btntipooper" runat="server" Text="BUSCAR" class="btn btn-danger btn-sm" OnClick="btntipooper_Click" />
                    </div>
                    <br />
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Relevancia</div>
                        <asp:DropDownList ID="cborelevancia" class="form-select form-select-sm text-white-dark" runat="server" Width="300px"></asp:DropDownList>&nbsp;
                    <asp:Button ID="btnrelev" runat="server" Text="BUSCAR" class="btn btn-danger btn-sm" OnClick="btnrelev_Click" />
                    </div>
                    <br />
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre(s)</div>
                        <asp:TextBox ID="txtnombre" runat="server" class="form-input ltr:rounded-l-none rtl:rounded-r-none py-1.5 text-xs" Width="150px"></asp:TextBox>&nbsp;
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Paterno</div>
                        <asp:TextBox ID="txtpaterno" runat="server" class="form-input ltr:rounded-l-none rtl:rounded-r-none py-1.5 text-xs" Width="150px"></asp:TextBox>&nbsp;
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Materno</div>
                        <asp:TextBox ID="txtmaterno" runat="server" class="form-input ltr:rounded-l-none rtl:rounded-r-none py-1.5 text-xs" Width="150px"></asp:TextBox>&nbsp;
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Ap. Esposo</div>
                        <asp:TextBox ID="txtesposo" runat="server" class="form-input ltr:rounded-l-none rtl:rounded-r-none py-1.5 text-xs" Width="150px"></asp:TextBox>&nbsp;
                    <asp:Button ID="btnaprehen" runat="server" Text="BUSCAR APREHENDIDOS" class="btn btn-danger btn-sm" OnClick="btnaprehen_Click" />&nbsp;
                    <asp:Button ID="btnarrestado" runat="server" Text="BUSCAR ARRESTADOS" class="btn btn-danger btn-sm" OnClick="btnarrestado_Click" />&nbsp;
                    </div>
                </div>
            </div>
            <br />
            <asp:GridView ID="GridOperativos" runat="server" AutoGenerateColumns="False" Width="100%"
                Font-Size="X-Small" HorizontalAlign="Justify"
                OnSelectedIndexChanged="GridOperativos_SelectedIndexChanged" CellPadding="4"
                border="0" class="stdtable" ForeColor="#333333" GridLines="None">
                <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
                <Columns>
                    <asp:BoundField DataField="op1" HeaderText="Id" />
                    <asp:BoundField DataField="op2" HeaderText="Nro. de Operativo" />
                    <asp:BoundField DataField="op3" HeaderText="Nro. Caso" />
                    <asp:BoundField DataField="op4" HeaderText="Nombre Operativo" />
                    <asp:BoundField DataField="op5" HeaderText="Asignado" />
                    <asp:BoundField DataField="op6" DataFormatString="{0:f}" HeaderText="Fecha Operativo" />
                    <asp:BoundField DataField="op7" HeaderText="Lugar" />
                    <asp:BoundField DataField="op8" HeaderText="Grupo" />
                    <asp:BoundField DataField="op9" HeaderText="Coca" />
                    <asp:BoundField DataField="op10" HeaderText="Droga" />
                    <asp:BoundField DataField="op11" HeaderText="Sustancias Solidas" />
                    <asp:BoundField DataField="op12" HeaderText="Sustancias Liquidas" />
                    <asp:BoundField DataField="op13" HeaderText="Fabricas" />
                    <asp:BoundField DataField="op14" HeaderText="Arrestados" />
                    <asp:BoundField DataField="op15" HeaderText="Aprehendidos" />
                    <asp:BoundField DataField="op16" HeaderText="Bienes Secuestrados" />
                    <asp:CommandField SelectText="Seleccionar Informe" ShowSelectButton="True" ButtonType="Image" SelectImageUrl="~/assets/images/distributor-report-icon.png" />
                </Columns>
                <EditRowStyle BackColor="#999999" />
                <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
                <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
                <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                <SortedAscendingCellStyle BackColor="#E9E7E2" />
                <SortedAscendingHeaderStyle BackColor="#506C8C" />
                <SortedDescendingCellStyle BackColor="#FFFDF8" />
                <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
            </asp:GridView>
        </div>
    </div>
</asp:Content>
