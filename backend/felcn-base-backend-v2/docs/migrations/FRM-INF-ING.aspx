<%@ Page Title="" Language="C#" MaintainScrollPositionOnPostback="true" MasterPageFile="~/PaginaPrin.master" AutoEventWireup="true" CodeFile="FRM-INF-ING.aspx.cs" Inherits="Forms_FRM_INF_ING" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="animate__animated p-6">        
    <div class="panel">
        <div class="mb-5 flex items-center justify-between">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">REGISTRO DE CASOS</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a href="javascript:;" class="p-1.5 px-3 ltr:pl-6 rtl:pr-6 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Casos Nuevos</a></li>
            </ol>
        </div>
        <asp:Button ID="btnActualizar" runat="server" class="btn btn-success" Text="Actualizar" OnClick="btnActualizar_Click"/>
        <br />
        <asp:GridView ID="Gridcasosing" runat="server" AutoGenerateColumns="False" class="table-striped" OnSelectedIndexChanged="Gridcasosing_SelectedIndexChanged" Font-Size="Small">
            <Columns>
                <asp:BoundField DataField="P1" HeaderText="Id" />
                <asp:BoundField DataField="P2" HeaderText="Unidad" />
                <asp:BoundField DataField="P3" HeaderText="Distrital" />
                <asp:BoundField DataField="P4" HeaderText="Grupo" />
                <asp:BoundField DataField="P5" HeaderText="Nro. Caso" />
                <asp:BoundField DataField="P6" HeaderText="Perdida de Dominio" />
                <asp:BoundField DataField="P7" HeaderText="Nro. Operativo" />
                <asp:BoundField DataField="P8" HeaderText="Nombre Operativo" />
                <asp:BoundField DataField="P9" HeaderText="Fecha y Hora del Op." />
                <asp:BoundField DataField="P10" HeaderText="Asignado al Caso" />
                <asp:BoundField DataField="P11" HeaderText="Fiscal Asignado" />                
                <asp:CommandField ButtonType="Image" SelectImageUrl="assets/images/distributor-report-icon.png" ShowSelectButton="True" />
            </Columns>
            <RowStyle Font-Size="Small" />
        </asp:GridView>
    </div>
    <br />
    <div class="panel">
        <div class="mb-5 flex items-center justify-between">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">REGISTRO DE CASOS</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a href="javascript:;" class="p-1.5 px-3 ltr:pl-6 rtl:pr-6 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Actualizacion de Casos</a></li>
            </ol>
        </div>
        <br />
        <asp:Button ID="btnlimpiar" runat="server" class="btn btn-success" Text="Limpiar Datos" OnClick="btnlimpiar_Click"/>
        <br />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="flex">
                <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Caso</div>
                <asp:TextBox ID="txtnumero" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                <asp:Button ID="btnnumerocaso" runat="server" Text="Buscar" class="btn btn-secondary btn-sm" OnClick="btnnumerocaso_Click"/>
            </div>
            <div class="flex">                
                <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre del Caso</div>
                <asp:TextBox ID="txtnombre" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                <asp:Button ID="btnnombrecaso" runat="server" Text="Buscar" class="btn btn-secondary btn-sm" OnClick="btnnombrecaso_Click"/>
            </div>
            <div class="flex">                
                <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Desde</div>
                <asp:TextBox ID="txtdesde" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Hasta</div>
                <asp:TextBox ID="txthasta" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                <asp:Button ID="btnrango" runat="server" Text="Buscar" class="btn btn-secondary btn-sm" OnClick="btnrango_Click"/>
            </div>
        </div>
        <br />
        <asp:GridView ID="Gridcasosact" runat="server" AutoGenerateColumns="False" Font-Size="Small" OnRowCommand="Gridcasosact_RowCommand" CellPadding="1" ForeColor="#333333" GridLines="None" CellSpacing="1">
            <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
            <Columns>
                <asp:BoundField DataField="P1" HeaderText="Id" />
                <asp:BoundField DataField="P2" HeaderText="Unidad" />
                <asp:BoundField DataField="P3" HeaderText="Distrital" />
                <asp:BoundField DataField="P4" HeaderText="Grupo" />
                <asp:BoundField DataField="P5" HeaderText="Nro. Caso" />
                <asp:BoundField DataField="P6" HeaderText="Perdida de Dominio" />
                <asp:BoundField DataField="P7" HeaderText="Nro. Operativo" />
                <asp:BoundField DataField="P8" HeaderText="Nombre Operativo" />
                <asp:BoundField DataField="P9" HeaderText="Asignado al Caso" />
                <asp:BoundField DataField="P10" HeaderText="Fiscal Asignado" />                
                <asp:TemplateField HeaderText="Procedimientos">
                    <ItemTemplate>
                        <asp:Button ID="Button4" runat="server" CommandName="parametro1" CommandArgument="<%# ((GridViewRow) Container).RowIndex %>" class="btn btn-primary btn-sm" Text="Casos" Width="75px" />
                        <asp:Button ID="Button5" runat="server" CommandName="parametro2" CommandArgument="<%# ((GridViewRow) Container).RowIndex %>" class="btn btn-info btn-sm" Text="Personas" Width="75px" />
                        <asp:Button ID="Button6" runat="server" CommandName="parametro3" CommandArgument="<%# ((GridViewRow) Container).RowIndex %>" class="btn btn-success btn-sm" Text="Bienes" Width="75px" />                        
                    </ItemTemplate>
                    <ControlStyle BorderStyle="None" />
                </asp:TemplateField>
            </Columns>
            <EditRowStyle BackColor="#999999" />
            <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
            <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
            <PagerSettings FirstPageText="" LastPageText="" NextPageText="" PreviousPageText="" FirstPageImageUrl="~/assets/images/icons8-doble-izquierda-32.png" LastPageImageUrl="~/assets/images/icons8-doble-derecha-32.png" NextPageImageUrl="~/assets/images/icons8-adelante-32.png" PreviousPageImageUrl="~/assets/images/icons8-atrás-32.png" />
            <PagerStyle BackColor="#284775" BorderStyle="None" Font-Size="Medium" ForeColor="White" HorizontalAlign="Center" />
            <RowStyle Font-Size="Small" BackColor="#F7F6F3" ForeColor="#333333" />
            <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
            <SortedAscendingCellStyle BackColor="#E9E7E2" />
            <SortedAscendingHeaderStyle BackColor="#506C8C" />
            <SortedDescendingCellStyle BackColor="#FFFDF8" />
            <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
        </asp:GridView>
    </div>    
</div>
</asp:Content>

